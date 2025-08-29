import React from 'react';
import { Chemical } from '../types';

interface LowStockNotificationProps {
  chemicals: Chemical[];
  onOpenUpdateModal: (chemical: Chemical) => void;
}

const LowStockNotification: React.FC<LowStockNotificationProps> = ({ chemicals, onOpenUpdateModal }) => {
  if (chemicals.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow-md animate-fade-in" role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Peringatan Stok Rendah</p>
          <p className="text-sm">Bahan kimia berikut memiliki stok di bawah 10%:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {chemicals.map(chemical => (
              <li key={chemical.id}>
                <span className="font-semibold">{chemical.name}</span> (Lokasi: {chemical.location}) - Stok: {chemical.currentStock} {chemical.unit}.
                <button
                  onClick={() => onOpenUpdateModal(chemical)}
                  className="ml-2 text-sm font-medium text-primary hover:underline"
                >
                  Update
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LowStockNotification;