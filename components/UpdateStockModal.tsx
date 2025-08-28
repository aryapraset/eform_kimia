import React, { useState } from 'react';
import { Chemical } from '../types';

interface UpdateStockModalProps {
  chemical: Chemical;
  onUpdate: (chemicalId: string, newStock: number, user: string) => void;
  onClose: () => void;
}

const UpdateStockModal: React.FC<UpdateStockModalProps> = ({ chemical, onUpdate, onClose }) => {
  const [newStock, setNewStock] = useState<string>(chemical.currentStock.toString());
  const [user, setUser] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockValue = parseFloat(newStock);

    if (isNaN(stockValue) || stockValue < 0) {
      setError('Jumlah stok harus berupa angka non-negatif.');
      return;
    }
    
    if (!user.trim()) {
        setError('Nama pengupdate wajib diisi.');
        return;
    }

    setError(null);
    onUpdate(chemical.id, stockValue, user);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4 transform animate-slide-in-up"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-primary mb-2">Update Stok</h2>
        <p className="text-gray-600 mb-6">
          Update jumlah stok untuk <span className="font-bold">{chemical.name}</span>.
        </p>
        
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newStock" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Stok Baru
            </label>
            <div className="relative">
              <input
                type="number"
                id="newStock"
                value={newStock}
                onChange={e => setNewStock(e.target.value)}
                className="w-full pl-4 pr-16 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150"
                min="0"
                step="any"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{chemical.unit}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pengupdate
            </label>
            <input
                type="text"
                id="user"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150"
                placeholder="Nama Lengkap Anda"
                required
              />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white bg-primary hover:bg-opacity-90 transition duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStockModal;
