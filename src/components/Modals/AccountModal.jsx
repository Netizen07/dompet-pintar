import React from 'react';
import { Trash2 } from 'lucide-react';
import { CARD_COLORS } from '../../utils/constants'; // Import konstanta warna

export default function AccountModal({ 
  isOpen, onClose, isEditing, forms, updateForm, submitAccount, deleteAccount 
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-6">
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-bounce-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-800">{isEditing?'Edit Dompet':'Tambah Dompet'}</h3>
                {isEditing && (
                    <button onClick={()=>deleteAccount(forms.account.id)} className="text-rose-500"><Trash2 size={20}/></button>
                )}
            </div>
            <form onSubmit={submitAccount} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 ml-2">Tipe Akun</label>
                    <div className="flex gap-2 mt-1">
                        {[{id:'cash',label:'Tunai',icon:'💵'},{id:'bank',label:'Bank',icon:'🏦'},{id:'ewallet',label:'E-Wallet',icon:'📱'}].map(t => (
                            <button key={t.id} type="button" onClick={()=> {
                                updateForm('account','type', t.id);
                                updateForm('account','icon', t.icon);
                            }} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${forms.account.type===t.id?'bg-indigo-50 border-indigo-500 text-indigo-700':'border-slate-200 text-slate-500'}`}>
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>
                <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Contoh: BCA Utama" value={forms.account.name} onChange={e=>updateForm('account','name',e.target.value)} required/>
                {!isEditing && (
                    <input type="number" className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Saldo Awal Rp" value={forms.account.balance} onChange={e=>updateForm('account','balance',e.target.value)}/>
                )}
                <div>
                    <label className="text-xs font-bold text-slate-400 ml-2">Warna Kartu</label>
                    <div className="flex gap-2 mt-1 overflow-x-auto pb-2">
                        {CARD_COLORS.map(c => (
                            <button key={c} type="button" onClick={() => updateForm('account', 'color', c)} className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} flex-shrink-0 border-2 ${forms.account.color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}></button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-bold">Batal</button>
                    <button className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Simpan</button>
                </div>
            </form>
        </div>
    </div>
  );
}