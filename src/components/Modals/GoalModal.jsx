import React from 'react';
import { Trash2 } from 'lucide-react';

export default function GoalModal({ 
  isOpen, onClose, isEditing, forms, updateForm, submitGoal, deleteGoal 
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-6">
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-bounce-in">
            <h3 className="font-bold text-lg mb-4">{isEditing ? 'Edit Impian' : 'Tambah Impian'}</h3>
            <form onSubmit={submitGoal} className="space-y-4">
                <input 
                    className="w-full bg-slate-50 p-4 rounded-xl font-bold" 
                    placeholder="Nama Impian" 
                    value={forms.goal.name} 
                    onChange={e => updateForm('goal', 'name', e.target.value)}
                />
                <input 
                    className="w-full bg-slate-50 p-4 rounded-xl font-bold" 
                    type="number" 
                    placeholder="Target Rp" 
                    value={forms.goal.target} 
                    onChange={e => updateForm('goal', 'target', e.target.value)}
                />
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 font-bold">Batal</button>
                    {isEditing && (
                        <button type="button" onClick={() => deleteGoal(forms.goal.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                            <Trash2 size={20}/>
                        </button>
                    )}
                    <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan</button>
                </div>
            </form>
        </div>
    </div>
  );
}