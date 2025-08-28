
import React, { useState } from 'react';
import { Chemical } from '../types';

type NewChemicalData = Omit<Chemical, 'id' | 'currentStock'>;

interface AddChemicalFormProps {
  locations: string[];
  onAddChemical: (chemical: NewChemicalData, user: string) => void;
  onCancel: () => void;
}

const AddChemicalForm: React.FC<AddChemicalFormProps> = ({ locations, onAddChemical, onCancel }) => {
  const [formData, setFormData] = useState<Omit<NewChemicalData, 'location'>>({
    name: '',
    formula: '',
    initialStock: 0,
    unit: 'mL',
    casNumber: '',
  });
  const [location, setLocation] = useState<string>(locations[0] || '');
  const [newLocation, setNewLocation] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isNewLocation = location === '__NEW__';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialStock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = isNewLocation ? newLocation.trim() : location;

    if (!formData.name || formData.initialStock <= 0 || !finalLocation || !user) {
      setError('Nama, Stok Awal, Lokasi, dan Nama Penambah wajib diisi. Stok Awal harus lebih dari 0.');
      return;
    }
    setError(null);

    onAddChemical({
      ...formData,
      location: finalLocation,
    }, user);
  };

  return (
    <section className="max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-primary mb-2">Tambah Bahan Kimia Baru</h2>
            <p className="text-gray-500 mb-8">Masukkan detail bahan kimia untuk menambahkannya ke inventaris.</p>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{error}</p></div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Bahan Kimia</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="e.g., Asam Klorida" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150" required />
                    </div>
                    <div>
                        <label htmlFor="formula" className="block text-sm font-medium text-gray-700 mb-1">Formula Kimia</label>
                        <input type="text" name="formula" id="formula" value={formData.formula} onChange={handleChange} placeholder="e.g., HCl" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150" />
                    </div>
                </div>

                <div>
                    <label htmlFor="casNumber" className="block text-sm font-medium text-gray-700 mb-1">Nomor CAS (Opsional)</label>
                    <input type="text" name="casNumber" id="casNumber" value={formData.casNumber} onChange={handleChange} placeholder="e.g., 7647-01-0" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="initialStock" className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                        <input type="number" name="initialStock" id="initialStock" value={formData.initialStock} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150" min="0" step="any" required />
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                        <select name="unit" id="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150">
                            <option value="mL">mL</option>
                            <option value="g">g</option>
                            <option value="L">L</option>
                            <option value="kg">kg</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">Nama Penambah</label>
                    <input type="text" name="user" id="user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nama Lengkap Anda" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150" required />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <select id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150">
                        <option value="" disabled>Pilih lokasi...</option>
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        <option value="__NEW__">Tambah Lokasi Baru...</option>
                    </select>
                </div>

                {isNewLocation && (
                     <div className="animate-fade-in">
                        <label htmlFor="newLocation" className="block text-sm font-medium text-gray-700 mb-1">Nama Lokasi Baru</label>
                        <input type="text" id="newLocation" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="e.g., Lemari Asam 2" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150" />
                    </div>
                )}


                <div className="flex items-center justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300">
                        Batal
                    </button>
                    <button type="submit" className="px-6 py-2 rounded-md text-white bg-primary hover:bg-opacity-90 transition duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>Tambah Bahan Kimia</span>
                    </button>
                </div>
            </form>
        </div>
    </section>
  );
};

export default AddChemicalForm;
