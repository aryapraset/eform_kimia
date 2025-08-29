import { supabase } from './supabaseClient';

// Fungsi untuk menguji koneksi Supabase
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('chemicals').select('count(*)');
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return { success: false, error };
    }
    
    console.log('Successfully connected to Supabase:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception when connecting to Supabase:', err);
    return { success: false, error: err };
  }
};

// Fungsi untuk menguji penambahan data
export const testAddChemical = async () => {
  const testChemical = {
    id: `test-${Date.now()}`,
    name: 'Test Chemical',
    formula: 'H2O',
    initialStock: 100,
    currentStock: 100,
    unit: 'mL',
    location: 'Test Location',
    casNumber: '7732-18-5'
  };
  
  try {
    const { data, error } = await supabase
      .from('chemicals')
      .insert(testChemical)
      .select();
    
    if (error) {
      console.error('Error adding test chemical:', error);
      return { success: false, error };
    }
    
    console.log('Successfully added test chemical:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception when adding test chemical:', err);
    return { success: false, error: err };
  }
};

// Fungsi untuk membuat tabel yang benar di Supabase
export const createCorrectTables = async () => {
  try {
    // Buat tabel chemicals dengan struktur yang benar
    const { error: createChemicalsError } = await supabase.rpc('create_chemicals_table');
    
    if (createChemicalsError) {
      console.error('Error creating chemicals table:', createChemicalsError);
      return { success: false, error: createChemicalsError };
    }
    
    // Buat tabel usage_logs
    const { error: createUsageLogsError } = await supabase.rpc('create_usage_logs_table');
    
    if (createUsageLogsError) {
      console.error('Error creating usage_logs table:', createUsageLogsError);
      return { success: false, error: createUsageLogsError };
    }
    
    // Buat tabel stock_history
    const { error: createStockHistoryError } = await supabase.rpc('create_stock_history_table');
    
    if (createStockHistoryError) {
      console.error('Error creating stock_history table:', createStockHistoryError);
      return { success: false, error: createStockHistoryError };
    }
    
    console.log('All tables created successfully');
    return { success: true };
  } catch (err) {
    console.error('Exception when creating tables:', err);
    return { success: false, error: err };
  }
};