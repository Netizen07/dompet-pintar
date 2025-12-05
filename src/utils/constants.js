export const CARD_COLORS = [
  'from-slate-500 to-slate-700',
  'from-emerald-400 to-emerald-600',
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-indigo-700',
  'from-purple-500 to-purple-700',
  'from-rose-400 to-rose-600',
  'from-orange-400 to-orange-600'
];

// DEFAULT DATA
export const INITIAL_DATA = {
  user: { name: 'Sultan Muda', pin: null },
  accounts: [
    { id: '1', name: 'Cash Tunai', type: 'cash', balance: 0, icon: '💵', color: 'from-emerald-400 to-emerald-600' },
    { id: '2', name: 'Bank BCA', type: 'bank', balance: 0, icon: '🏦', color: 'from-blue-500 to-blue-700' },
    { id: '3', name: 'GoPay', type: 'ewallet', balance: 0, icon: '📱', color: 'from-sky-400 to-sky-600' },
  ],
  transactions: [],
  budgets: [
    { id: 'b1', name: 'Makan & Minum', limit: 2500000, spent: 0, color: 'bg-orange-500', icon: '🍔' },
    { id: 'b2', name: 'Transportasi', limit: 1000000, spent: 0, color: 'bg-indigo-500', icon: '🚗' },
  ],
  debts: [], 
  goals: [],
};