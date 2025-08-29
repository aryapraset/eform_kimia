import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Chemical, UsageLog, StockHistory, HistoryLog } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UsageForm from './components/UsageForm';
import AddChemicalForm from './components/AddChemicalForm';
import UpdateStockModal from './components/UpdateStockModal';
import History from './components/History';
import { supabase } from './supabaseClient';

// Hapus initialChemicals karena akan diambil dari Supabase

type View = 'dashboard' | 'form' | 'add-chemical-form' | 'history';

function App() {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [view, setView] = useState<View>('dashboard');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingChemical, setUpdatingChemical] = useState<Chemical | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchChemicals();
    fetchUsageLogs();
    fetchStockHistory();
  }, []);

  const fetchChemicals = async () => {
    try {
      const { data, error } = await supabase
        .from('chemicals')
        .select('*');

      if (error) throw error;

      if (data) setChemicals(data);
    } catch (error) {
      console.error('Error fetching chemicals:', error);
      showNotification('Gagal memuat data bahan kimia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('usage_logs')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) setUsageLogs(data);
    } catch (error) {
      console.error('Error fetching usage logs:', error);
    }
  };

  const fetchStockHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_history')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) setStockHistory(data);
    } catch (error) {
      console.error('Error fetching stock history:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLogUsage = useCallback(async (log: Omit<UsageLog, 'id' | 'date' | 'type' | 'chemicalName' | 'chemicalFormula' | 'unit'>) => {
    const chemical = chemicals.find(c => c.id === log.chemicalId);
    if (!chemical) return;

    const newStock = chemical.currentStock - log.amountUsed;
    const updatedStock = newStock < 0 ? 0 : newStock;

    // Update chemical stock in Supabase
    try {
      const { error: updateError } = await supabase
        .from('chemicals')
        .update({ currentStock: updatedStock })
        .eq('id', log.chemicalId);

      if (updateError) throw updateError;

      // Update local state
      setChemicals(prevChemicals =>
        prevChemicals.map(chem => {
          if (chem.id === log.chemicalId) {
            return { ...chem, currentStock: updatedStock };
          }
          return chem;
        })
      );

      // Create new usage log
      const newLog: UsageLog = {
        ...log,
        id: `usage-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'usage',
        chemicalName: chemical.name,
        chemicalFormula: chemical.formula,
        unit: chemical.unit,
      };

      // Insert usage log to Supabase
      const { error: logError } = await supabase
        .from('usage_logs')
        .insert(newLog);

      if (logError) throw logError;

      // Update local state
      setUsageLogs(prev => [newLog, ...prev]);

      showNotification(`Penggunaan ${log.amountUsed} ${chemical.unit} ${chemical.name} berhasil dicatat!`, 'success');
      setView('dashboard');
    } catch (error) {
      console.error('Error logging usage:', error);
      showNotification('Gagal mencatat penggunaan bahan kimia', 'error');
    }
  }, [chemicals]);

  const handleAddChemical = useCallback(async (newChemicalData: Omit<Chemical, 'id' | 'currentStock'>, user: string) => {
    try {
      // Buat ID unik untuk bahan kimia baru
      const newChemical: Chemical = {
        ...newChemicalData,
        id: `chem-${Date.now()}`,
        currentStock: newChemicalData.initialStock,
      };

      console.log("Mencoba menambahkan bahan kimia:", newChemical);

      // Insert new chemical to Supabase
      const { data: insertedChemical, error: chemicalError } = await supabase
        .from('chemicals')
        .insert(newChemical)
        .select()
        .single();

      if (chemicalError) {
        console.error("Error detail:", chemicalError);
        throw chemicalError;
      }

      console.log("Bahan kimia berhasil ditambahkan:", insertedChemical);

      // Update local state
      setChemicals(prev => [...prev, newChemical].sort((a, b) => a.name.localeCompare(b.name)));

      // Create stock history log
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

      console.log("Mencoba menambahkan riwayat stok:", newStockLog);

      // Insert stock history to Supabase
      const { error: historyError } = await supabase
        .from('stock_history')
        .insert(newStockLog);

      if (historyError) {
        console.error("Error detail riwayat:", historyError);
        throw historyError;
      }

      // Update local state
      setStockHistory(prev => [newStockLog, ...prev]);

      showNotification(`Bahan kimia ${newChemical.name} berhasil ditambahkan!`, 'success');
      setView('dashboard');
    } catch (error: any) {
      console.error('Error adding chemical:', error);
      // Tampilkan pesan error yang lebih spesifik
      showNotification(`Gagal menambahkan bahan kimia: ${error.message || 'Terjadi kesalahan'}`, 'error');
    }
  }, []);

  const handleUpdateStock = useCallback(async (chemicalId: string, newStock: number, user: string) => {
    const chemical = chemicals.find(c => c.id === chemicalId);
    if (!chemical) return;

    const amountAdded = newStock - chemical.currentStock;
    const newInitialStock = newStock > chemical.initialStock ? newStock : chemical.initialStock;

    try {
      // Update chemical in Supabase
      const { error: updateError } = await supabase
        .from('chemicals')
        .update({
          currentStock: newStock,
          initialStock: newInitialStock
        })
        .eq('id', chemicalId);

      if (updateError) throw updateError;

      // Update local state
      setChemicals(prevChemicals =>
        prevChemicals.map(chem => {
          if (chem.id === chemicalId) {
            return { ...chem, currentStock: newStock, initialStock: newInitialStock };
          }
          return chem;
        })
      );

      // Create stock history log
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

      // Insert stock history to Supabase
      const { error: historyError } = await supabase
        .from('stock_history')
        .insert(newStockLog);

      if (historyError) throw historyError;

      // Update local state
      setStockHistory(prev => [newStockLog, ...prev]);

      showNotification(`Stok ${chemical.name} berhasil diperbarui!`, 'success');
      setUpdatingChemical(null); // Close modal
    } catch (error) {
      console.error('Error updating stock:', error);
      showNotification('Gagal memperbarui stok bahan kimia', 'error');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

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