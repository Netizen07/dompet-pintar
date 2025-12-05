import React from 'react';
import { Trophy, Edit3, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function GoalsView({ 
  goals, openAddGoal, setForms, setIsEditing, setActiveModal, deleteGoal, accounts 
}) {
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const defaultAccountId = accounts[0]?.id;

  return (
    <div className="animate-fade-in space-y-4">
        {/* Header Total Tabungan */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 mb-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Tabungan Impian</p>
            <h2 className="text-3xl font-extrabold text-purple-600">{formatCurrency(totalSaved)}</h2>
        </div>

        {/* Tombol Tambah */}
        <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="font-bold text-lg">Daftar Impian</h3>
            <button onClick={openAddGoal} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">+ Baru</button>
        </div>

        {/* List Goals */}
        {goals.map(g => {
            const progress = Math.min((g.current / g.target) * 100, 100);
            const remaining = g.target - g.current;
            return (
                <div key={g.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 flex gap-2">
                        <button onClick={()=>{setForms(p=>({...p, goal:{...g}})); setIsEditing(true); setActiveModal('goal')}} className="text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                        <button onClick={()=>deleteGoal(g.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><Trophy size={24}/></div>
                        <div><h3 className="font-bold text-slate-800 text-lg">{g.name}</h3><p className="text-xs text-slate-400">Target: {formatCurrency(g.target)}</p></div>
                    </div>
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-2 font-bold">
                            <span className="text-purple-600">Terkumpul: {formatCurrency(g.current)}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000" style={{width: `${progress}%`}}></div>
                        </div>
                        {remaining > 0 ? <p className="text-xs text-rose-500 mt-2 font-medium">Kurang {formatCurrency(remaining)} lagi!</p> : <p className="text-xs text-emerald-500 mt-2 font-bold">Tercapai! 🎉</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={()=>{setForms(p=>({...p, withdrawGoal:{goalId:g.id, amount:'', accountId:defaultAccountId}})); setActiveModal('withdrawGoal')}} className="py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Tarik</button>
                        <button onClick={()=>{setForms(p=>({...p, saving:{goalId:g.id, amount:'', accountId:defaultAccountId}})); setActiveModal('saving')}} className="py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200">Nabung</button>
                    </div>
                </div>
            );
        })}
    </div>
  );
}