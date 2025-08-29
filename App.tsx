
import React, { useState, useCallback, useMemo } from 'react';
import { Chemical, UsageLog, StockHistory, HistoryLog } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UsageForm from './components/UsageForm';
import AddChemicalForm from './components/AddChemicalForm';
import UpdateStockModal from './components/UpdateStockModal';
import History from './components/History';

const initialChemicals: Chemical[] = [
  { id: '1', name: 'Asam Klorida', formula: 'HCl', initialStock: 5000, currentStock: 4500, unit: 'mL', location: 'Rak A1', casNumber: '7647-01-0', expirationDate: '2025-12-31' },
  { id: '2', name: 'Natrium Hidroksida', formula: 'NaOH', initialStock: 2000, currentStock: 1850, unit: 'g', location: 'Rak A2', casNumber: '1310-73-2', expirationDate: '2026-06-01' },
  { id: '3', name: 'Asam Sulfat', formula: 'H₂SO₄', initialStock: 3000, currentStock: 120, unit: 'mL', location: 'Rak B1', casNumber: '7664-93-9', expirationDate: '2025-08-15' },
  { id: '4', name: 'Etanol', formula: 'C₂H₅OH', initialStock: 10000, currentStock: 9500, unit: 'mL', location: 'Rak C3', casNumber: '64-17-5', expirationDate: '2027-01-01' },
  { id: '5', name: 'Aseton', formula: 'C₃H₆O', initialStock: 5000, currentStock: 4800, unit: 'mL', location: 'Rak C4', casNumber: '67-64-1', expirationDate: '2026-10-20' },
  { id: '6', name: 'Kalium Permanganat', formula: 'KMnO₄', initialStock: 500, currentStock: 45, unit: 'g', location: 'Rak D1', casNumber: '7722-64-7', expirationDate: '2024-09-01' }, // Expiring soon
  { id: '7', name: 'Metanol', formula: 'CH₃OH', initialStock: 5000, currentStock: 4900, unit: 'mL', location: 'Rak C5', casNumber: '67-56-1', expirationDate: '2023-01-01' }, // Expired
  { id: '8', name: 'Iodium', formula: 'I₂', initialStock: 250, currentStock: 250, unit: 'g', location: 'Rak D2', casNumber: '7553-56-2' },
];

type View = 'dashboard' | 'form' | 'add-chemical-form' | 'history';

function App() {
  const [chemicals, setChemicals] = useState<Chemical[]>(initialChemicals);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [view, setView] = useState<View>('dashboard');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingChemical, setUpdatingChemical] = useState<Chemical | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLogUsage = useCallback((log: Omit<UsageLog, 'id' | 'date' | 'type' | 'chemicalName' | 'chemicalFormula' | 'unit'>) => {
    const chemical = chemicals.find(c=>c.id === log.chemicalId);
    if (!chemical) return;

    setChemicals(prevChemicals =>
      prevChemicals.map(chem => {
        if (chem.id === log.chemicalId) {
          const newStock = chem.currentStock - log.amountUsed;
          return { ...chem, currentStock: newStock < 0 ? 0 : newStock };
        }
        return chem;
      })
    );

    const newLog: UsageLog = {
      ...log,
      id: `usage-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'usage',
      chemicalName: chemical.name,
      chemicalFormula: chemical.formula,
      unit: chemical.unit,
    };
    setUsageLogs(prev => [newLog, ...prev]);

    showNotification(`Penggunaan ${log.amountUsed} ${chemical.unit} ${chemical.name} berhasil dicatat!`, 'success');
    setView('dashboard');
  }, [chemicals]);

  const handleAddChemical = useCallback((newChemicalData: Omit<Chemical, 'id' | 'currentStock'>, user: string) => {
    const newChemical: Chemical = {
      ...newChemicalData,
      id: `chem-${Date.now()}`,
      currentStock: newChemicalData.initialStock,
    };
    setChemicals(prev => [...prev, newChemical].sort((a, b) => a.name.localeCompare(b.name)));
    
    const newStockLog: StockHistory = {
      id: `stock-${Date.now()}`,
      type: 'stock_update',
      chemicalId: newChemical.id,
      chemicalName: newChemical.name,
      chemicalFormula: newChemical.formula,
      amountAdded: newChemical.initialStock,
      previousStock: 0,
      newStock: newChemical.initialStock,
      user: user,
      date: new Date().toISOString(),
      unit: newChemical.unit,
    };
    setStockHistory(prev => [newStockLog, ...prev]);

    showNotification(`Bahan kimia ${newChemical.name} berhasil ditambahkan!`, 'success');
    setView('dashboard');
  }, []);
  
  const handleUpdateStock = useCallback((chemicalId: string, newStock: number, user: string) => {
    const chemical = chemicals.find(c => c.id === chemicalId);
    if (!chemical) return;
    
    const amountAdded = newStock - chemical.currentStock;

    setChemicals(prevChemicals =>
      prevChemicals.map(chem => {
        if (chem.id === chemicalId) {
          const newInitialStock = newStock > chem.initialStock ? newStock : chem.initialStock;
          return { ...chem, currentStock: newStock, initialStock: newInitialStock };
        }
        return chem;
      })
    );

    const newStockLog: StockHistory = {
        id: `stock-${Date.now()}`,
        type: 'stock_update',
        chemicalId: chemical.id,
        chemicalName: chemical.name,
        chemicalFormula: chemical.formula,
        amountAdded: amountAdded,
        previousStock: chemical.currentStock,
        newStock: newStock,
        user: user,
        date: new Date().toISOString(),
        unit: chemical.unit,
    };
    setStockHistory(prev => [newStockLog, ...prev]);

    showNotification(`Stok ${chemical.name} berhasil diperbarui!`, 'success');
    setUpdatingChemical(null); // Close modal
  }, [chemicals]);

  const lowStockChemicals = useMemo(() => {
    return chemicals.filter(chem => {
      if (chem.initialStock === 0) return false;
      const stockPercentage = (chem.currentStock / chem.initialStock) * 100;
      return stockPercentage < 10;
    });
  }, [chemicals]);


  const uniqueLocations = [...new Set(chemicals.map(c => c.location))].sort();

  const filteredChemicals = chemicals.filter(chem => {
    const query = searchQuery.toLowerCase();
    return (
      chem.name.toLowerCase().includes(query) ||
      chem.formula.toLowerCase().includes(query) ||
      chem.casNumber.toLowerCase().includes(query)
    );
  });
  
  const allHistory: HistoryLog[] = [...usageLogs, ...stockHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50 text-dark font-sans">
      {notification && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-fade-in`}>
          {notification.message}
        </div>
      )}
      <Header setView={setView} />
      <main className="container mx-auto p-4 md:p-8">
        {view === 'dashboard' && <Dashboard chemicals={filteredChemicals} onOpenUpdateModal={setUpdatingChemical} searchQuery={searchQuery} onSearchChange={setSearchQuery} lowStockChemicals={lowStockChemicals} />}
        {view === 'form' && <UsageForm chemicals={chemicals} onLogUsage={handleLogUsage} onCancel={() => setView('dashboard')} />}
        {view === 'add-chemical-form' && <AddChemicalForm locations={uniqueLocations} onAddChemical={handleAddChemical} onCancel={() => setView('dashboard')} />}
        {view === 'history' && <History logs={allHistory} />}
      </main>

      {updatingChemical && (
        <UpdateStockModal
          chemical={updatingChemical}
          onUpdate={handleUpdateStock}
          onClose={() => setUpdatingChemical(null)}
        />
      )}

      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} BBSPJIHPMM Chemical Traceability System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;