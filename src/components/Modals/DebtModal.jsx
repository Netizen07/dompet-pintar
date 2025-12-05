import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DebtModal({ 
  isOpen, onClose, isEditing, forms, updateForm, submitDebt, deleteDebt 
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-6">
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-bounce-in">
            <h3 className="font-bold text-lg mb-4">{isEditing ? 'Edit Catatan' : 'Catat Hutang'}</h3>
            <form onSubmit={submitDebt} className="space-y-4">
                {/* Switch Type */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['borrowed', 'lent'].map(t => (
                        <button key={t} type="button" onClick={() => updateForm('debt', 'type', t)} className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize ${forms.debt.type === t ? (t === 'borrowed' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white') : 'text-slate-500'}`}>
                            {t === 'borrowed' ? 'Saya Berhutang' : 'Saya Meminjamkan'}
                        </button>
                    ))}
                </div>

                <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Nama Orang" value={forms.debt.person} onChange={e => updateForm('debt', 'person', e.target.value)}/>
                <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" type="number" placeholder="Jumlah Rp" value={forms.debt.amount} onChange={e => updateForm('debt', 'amount', e.target.value)}/>
                
                <div className="mt-2">
                    <label className="text-xs text-slate-400 font-bold ml-2">Jatuh Tempo</label>
                    <input type="date" className="w-full bg-slate-50 p-4 rounded-xl mt-1 font-bold text-slate-700" value={forms.debt.dueDate} onChange={e => updateForm('debt', 'dueDate', e.target.value)}/>
                </div>

                <div className="flex gap-2 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 font-bold">Batal</button>
                    {isEditing && (
                        <button type="button" onClick={() => deleteDebt(forms.debt.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                            <Trash2 size={20}/>
                        </button>
                    )}
                    <button className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl">Simpan</button>
                </div>
            </form>
        </div>
    </div>
  );
}