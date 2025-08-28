
import React, { useState } from 'react';
import { Chemical } from '../types';

interface UsageFormProps {
  chemicals: Chemical[];
  onLogUsage: (log: { chemicalId: string; amountUsed: number; user:string }) => void;
  onCancel: () => void;
}

const UsageForm: React.FC<UsageFormProps> = ({ chemicals, onLogUsage, onCancel }) => {
  const [chemicalId, setChemicalId] = useState<string>(chemicals[0]?.id || '');
  const [amountUsed, setAmountUsed] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const selectedChemical = chemicals.find(c => c.id === chemicalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountUsed);
    
    if (!chemicalId || !amountUsed || !user) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError('Jumlah yang digunakan harus angka positif.');
      return;
    }
    if (selectedChemical && amount > selectedChemical.currentStock) {
      setError(`Jumlah yang digunakan melebihi stok yang tersedia (${selectedChemical.currentStock} ${selectedChemical.unit}).`);
      return;
    }

    setError(null);
    onLogUsage({ chemicalId, amountUsed: amount, user });
  };

  return (
    <section className="max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-primary mb-2">Formulir Penggunaan Bahan Kimia</h2>
            <p className="text-gray-500 mb-8">Catat setiap penggunaan untuk menjaga akurasi data inventaris.</p>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{error}</p></div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="chemical" className="block text-sm font-medium text-gray-700 mb-1">Pilih Bahan Kimia</label>
                    <select
                        id="chemical"
                        value={chemicalId}
                        onChange={(e) => setChemicalId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150"
                    >
                        {chemicals.map(chem => (
                            <option key={chem.id} value={chem.id}>
                                {chem.name} ({chem.formula}) - Stok: {chem.currentStock} {chem.unit}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Digunakan</label>
                    <div className="relative">
                        <input
                            type="number"
                            id="amount"
                            value={amountUsed}
                            onChange={(e) => setAmountUsed(e.target.value)}
                            placeholder="e.g., 50"
                            className="w-full pl-4 pr-16 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150"
                            min="0"
                            step="any"
                        />
                         <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">{selectedChemical?.unit}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                    <input
                        type="text"
                        id="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="Nama Lengkap Anda"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150"
                    />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300">
                        Batal
                    </button>
                    <button type="submit" className="px-6 py-2 rounded-md text-white bg-primary hover:bg-opacity-90 transition duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Simpan Catatan</span>
                    </button>
                </div>
            </form>
        </div>
    </section>
  );
};

export default UsageForm;
