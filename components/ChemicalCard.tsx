
import React from 'react';
import { Chemical } from '../types';

interface ChemicalCardProps {
  chemical: Chemical;
  onOpenUpdateModal: (chemical: Chemical) => void;
}

const ChemicalCard: React.FC<ChemicalCardProps> = ({ chemical, onOpenUpdateModal }) => {
  const stockPercentage = chemical.initialStock > 0 ? (chemical.currentStock / chemical.initialStock) * 100 : 0;

  const getStockColor = () => {
    if (stockPercentage > 50) return 'bg-green-500';
    if (stockPercentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getExpirationStatus = () => {
    if (!chemical.expirationDate) return { text: '-', color: 'text-gray-500' };

    const expDate = new Date(chemical.expirationDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    today.setHours(0, 0, 0, 0); 
    
    // The browser might interpret the date as UTC, so we adjust it to be timezone-neutral for comparison
    const expDateLocal = new Date(expDate.valueOf() + expDate.getTimezoneOffset() * 60 * 1000);
    expDateLocal.setHours(0,0,0,0);


    if (expDateLocal < today) {
        return { text: 'Kadaluarsa', color: 'text-red-600 font-bold' };
    }
    if (expDateLocal <= thirtyDaysFromNow) {
        return { text: 'Segera Kadaluarsa', color: 'text-yellow-600 font-bold' };
    }

    return { 
      text: expDateLocal.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 
      color: 'text-gray-600' 
    };
  };

  const expirationStatus = getExpirationStatus();


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out animate-slide-in-up flex flex-col justify-between">
      <div className="p-5">
        <h3 className="text-xl font-bold text-primary">{chemical.name}</h3>
        <p className="text-gray-500 font-mono text-sm">{chemical.formula}</p>
        <p className="text-xs text-gray-400 mt-1">CAS: {chemical.casNumber}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Stok Saat Ini:</span>
            <span className="font-bold text-lg text-dark">{chemical.currentStock.toLocaleString()} <span className="text-sm text-gray-500">{chemical.unit}</span></span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Lokasi:</span>
            <span className="px-2 py-1 bg-secondary text-white text-xs rounded-full">{chemical.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Kadaluarsa:</span>
            <span className={`text-sm ${expirationStatus.color}`}>{expirationStatus.text}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Tingkat Stok: {stockPercentage.toFixed(1)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getStockColor()} transition-all duration-500`}
              style={{ width: `${stockPercentage > 100 ? 100 : stockPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => onOpenUpdateModal(chemical)}
          className="px-4 py-1.5 text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition duration-300"
        >
          Update Stok
        </button>
      </div>
    </div>
  );
};

export default ChemicalCard;