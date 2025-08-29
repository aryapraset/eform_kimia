
export interface Chemical {
  id: string;
  name: string;
  formula: string;
  initialStock: number;
  currentStock: number;
  unit: 'mL' | 'g' | 'L' | 'kg';
  location: string;
  casNumber: string;
  expirationDate?: string;
}

export interface UsageLog {
  id: string;
  type: 'usage';
  chemicalId: string;
  chemicalName: string;
  chemicalFormula: string;
  amountUsed: number;
  user: string;
  date: string;
  unit: 'mL' | 'g' | 'L' | 'kg';
}

export interface StockHistory {
    id: string;
    type: 'stock_update';
    chemicalId: string;
    chemicalName: string;
    chemicalFormula: string;
    amountAdded: number;
    previousStock: number;
    newStock: number;
    user: string;
    date: string;
    unit: 'mL' | 'g' | 'L' | 'kg';
}

export type HistoryLog = UsageLog | StockHistory;