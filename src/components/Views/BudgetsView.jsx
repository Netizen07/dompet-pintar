import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetsView({ 
  budgets, openAddBudget, setForms, setIsEditing, setActiveModal, deleteBudget 
}) {
  const totalRemaining = budgets.reduce((sum, b) => sum + (b.limit - b.spent), 0);

  return (
    <div className="animate-fade-in space-y-4">
        {/* Header Sisa Anggaran */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 mb-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Sisa Anggaran Bulan Ini</p>
            <h2 className="text-3xl font-extrabold text-orange-600">{formatCurrency(totalRemaining)}</h2>
        </div>

        {/* Tombol Tambah */}
        <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="font-bold text-lg">Anggaran Saya</h3>
            <button onClick={openAddBudget} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">+ Baru</button>
        </div>

        {/* List Budget */}
        {budgets.map(b => {
            const percent = Math.min((b.spent/b.limit)*100, 100);
            const isCritical = percent > 80;
            return (
                <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 flex gap-2">
                        <button onClick={()=>{setForms(p=>({...p, budget:{...b}})); setIsEditing(true); setActiveModal('budget')}} className="text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                        <button onClick={()=>deleteBudget(b.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${b.color}`}>{b.icon}</div>
                        <div>
                            <h3 className="font-bold text-slate-800">{b.name}</h3>
                            <p className="text-xs text-slate-400">Limit: {formatCurrency(b.limit)}</p>
                        </div>
                    </div>
                    <div className="mb-1 flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Terpakai: {formatCurrency(b.spent)}</span>
                        <span className={isCritical?'text-rose-500':'text-emerald-500'}>Sisa: {formatCurrency(b.limit-b.spent)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className={`h-full ${b.color}`} style={{width:`${percent}%`}}></div>
                    </div>
                </div>
            );
        })}
    </div>
  );
}