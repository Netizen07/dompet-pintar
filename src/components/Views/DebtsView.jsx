import React from 'react';
import { HandCoins, UserMinus, Edit3, Trash2, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DebtsView({ 
  debts, openAddDebt, setForms, setIsEditing, setActiveModal, deleteDebt, accounts 
}) {
  const defaultAccountId = accounts[0]?.id;

  return (
    <div className="animate-fade-in space-y-4">
        {/* Tombol Tambah */}
        <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="font-bold text-lg">Catatan Hutang</h3>
            <button onClick={openAddDebt} className="text-xs bg-rose-600 text-white px-3 py-1 rounded-full">+ Baru</button>
        </div>

        {/* List Hutang */}
        {debts.map(d => {
            const isLent = d.type === 'lent';
            return (
                <div key={d.id} className={`bg-white p-5 rounded-3xl border shadow-sm relative overflow-hidden ${isLent ? 'border-emerald-100' : 'border-rose-100'}`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${isLent ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={()=>{setForms(p=>({...p, debt:{...d}})); setIsEditing(true); setActiveModal('debt')}} className="text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                        <button onClick={()=>deleteDebt(d.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLent ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {isLent ? <HandCoins size={20}/> : <UserMinus size={20}/>}
                        </div>
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isLent ? 'text-emerald-600' : 'text-rose-600'}`}>{isLent ? 'Saya Meminjamkan' : 'Saya Berhutang'}</p>
                            <h3 className="font-bold text-slate-800 text-lg">{d.person}</h3>
                            {d.dueDate && <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={10}/> Jatuh Tempo: {formatDate(d.dueDate)}</p>}
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-3">
                        <div><p className="text-xs text-slate-400">Total</p><p className="font-bold text-slate-700">{formatCurrency(d.amount)}</p></div>
                        <div className="text-right"><p className="text-xs text-slate-400">Sisa Belum Lunas</p><p className={`font-bold text-lg ${isLent ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(d.amount - d.paid)}</p></div>
                    </div>
                    {(d.amount - d.paid) > 0 ? (
                        <button onClick={()=>{setForms(p=>({...p, payDebt:{debtId:d.id, amount:'', accountId:defaultAccountId}})); setActiveModal('payDebt')}} className={`w-full py-2 rounded-xl text-xs font-bold text-white shadow-sm ${isLent ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                            {isLent ? 'Terima Pembayaran' : 'Bayar Cicilan'}
                        </button>
                    ) : (
                        <div className="w-full py-2 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2"><CheckCircle size={14}/> LUNAS</div>
                    )}
                </div>
            )
        })}
    </div>
  );
}