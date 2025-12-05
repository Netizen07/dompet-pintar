import React from 'react';
import { Trash2 } from 'lucide-react';

export default function BudgetModal({ 
  isOpen, onClose, isEditing, forms, updateForm, submitBudget, deleteBudget 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-6">
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-bounce-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{isEditing?'Edit Anggaran':'Buat Anggaran'}</h3>
                {isEditing && <button onClick={()=>deleteBudget(forms.budget.id)} className="text-rose-500"><Trash2/></button>}
            </div>
            <form onSubmit={submitBudget} className="space-y-4">
                <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Nama Kategori" value={forms.budget.name} onChange={e=>updateForm('budget','name',e.target.value)}/>
                <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" type="number" placeholder="Limit Bulanan Rp" value={forms.budget.limit} onChange={e=>updateForm('budget','limit',e.target.value)}/>
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 font-bold">Batal</button>
                    <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan</button>
                </div>
            </form>
        </div>
    </div>
  );
}