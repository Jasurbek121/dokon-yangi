export interface Store {
  id?: string;
  userId: string;
  name: string;
  sales: number;
  location?: string;
  createdAt?: any;
}

export interface InventoryItem {
  id?: string;
  userId: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  category?: string;
}

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Purchase {
  id?: string;
  userId: string;
  supplier: string;
  amount: number;
  date: string;
}

export const STORES_DATA = [
  { id: '1', name: "Gothway st", sales: 874000 },
  { id: '2', name: "The Rustic Fox", sales: 723000 },
  { id: '3', name: "Vincent Vine", sales: 590000 },
  { id: '4', name: "Blue Harbor", sales: 516000 },
  { id: '5', name: "Nubula Novelties", sales: 395000 },
  { id: '6', name: "Crimson Crofter", sales: 344000 },
  { id: '7', name: "Tidal Treasures", sales: 274000 },
  { id: '8', name: "Whimsy Wid", sales: 213000 },
  { id: '9', name: "Morgantide", sales: 183000 },
  { id: '10', name: "Empirium", sales: 176000 },
];

export const MONTHLY_DATA = [
  { name: 'Yan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Iyun', value: 700 },
];

export const PROFIT_EXPENSE_DATA = [
  { name: 'Xarajat', value: 40, fill: '#ef4444' },
  { name: 'Foyda', value: 30, fill: '#22c55e' },
];
