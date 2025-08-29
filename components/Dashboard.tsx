import React from 'react';
import { Chemical } from '../types';
import ChemicalCard from './ChemicalCard';
import LowStockNotification from './LowStockNotification';

interface DashboardProps {
  chemicals: Chemical[];
  onOpenUpdateModal: (chemical: Chemical) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lowStockChemicals: Chemical[];
}

const Dashboard: React.FC<DashboardProps> = ({ chemicals, onOpenUpdateModal, searchQuery, onSearchChange, lowStockChemicals }) => {
  return (
    <section className="animate-fade-in">
      <h2 className="text-3xl font-bold text-primary mb-6">Inventaris Bahan Kimia</h2>
      
      <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari nama, formula, atau nomor CAS..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150"
            aria-label="Cari bahan kimia"
          />
      </div>

      <LowStockNotification chemicals={lowStockChemicals} onOpenUpdateModal={onOpenUpdateModal} />

      {chemicals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chemicals.map(chemical => (
            <ChemicalCard key={chemical.id} chemical={chemical} onOpenUpdateModal={onOpenUpdateModal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Tidak Ditemukan</h3>
            <p className="text-gray-500 mt-2">Tidak ada bahan kimia yang cocok dengan pencarian Anda.</p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
