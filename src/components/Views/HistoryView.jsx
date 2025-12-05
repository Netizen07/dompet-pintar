import React, { useRef } from 'react';
import { 
  Search, CalendarDays, TrendingDown, TrendingUp, ArrowRightLeft, Edit3, Trash2 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function HistoryView({ 
  transactions,        // Data transaksi (sudah difilter)
  historyFilter,       // State filter
  setHistoryFilter,    // Fungsi update filter
  setActiveModal,      // Untuk buka modal edit
  setForms,            // Untuk isi data form saat edit
  deleteTransaction    // Fungsi hapus
}) {
  // Ref dipindahkan ke sini karena hanya dipakai di tampilan ini
  const dateInputRef = useRef(null);

  return (
    <div className="animate-fade-in space-y-4">
        {/* Filter Bar */}
        <div className="flex gap-2 px-1">
            <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 flex gap-2 shadow-sm">
                <Search size={18} className="text-slate-400"/>
                <input 
                    className="w-full outline-none text-sm" 
                    placeholder="Cari..." 
                    value={historyFilter.search} 
                    onChange={e => setHistoryFilter({...historyFilter, search:e.target.value})}
                />
            </div>
            <button 
                className={`p-3 rounded-xl border shadow-sm ${historyFilter.date?'bg-indigo-50 border-indigo-200 text-indigo-600':'bg-white text-slate-500'}`} 
                onClick={() => dateInputRef.current.showPicker()}
            >
                <CalendarDays size={20}/>
            </button>
            <input 
                type="date" 
                ref={dateInputRef} 
                className="w-0 h-0 absolute opacity-0" 
                onChange={e => setHistoryFilter({...historyFilter, date:e.target.value})}
            />
        </div>

        {/* Filter Jenis Transaksi */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 px-1">
            {['all','expense','income','transfer'].map(t => (
                <button key={t} onClick={() => setHistoryFilter({...historyFilter, type:t})} className={`px-4 py-2 rounded-full text-xs font-bold capitalize border ${historyFilter.type===t?'bg-indigo-600 text-white':'bg-white text-slate-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        {/* List Transaksi */}
        <div className="space-y-3 pb-24">
            {transactions.map(tx => (
                <div key={tx.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type==='expense'?'bg-rose-100 text-rose-500':tx.type==='income'?'bg-emerald-100 text-emerald-500':'bg-blue-100 text-blue-500'}`}>
                            {tx.type==='expense'?<TrendingDown size={18}/>:tx.type==='income'?<TrendingUp size={18}/>:<ArrowRightLeft size={18}/>}
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 text-sm">{tx.note||tx.type}</p>
                            <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className={`font-bold text-sm block ${tx.type==='expense'?'text-rose-500':tx.type==='income'?'text-emerald-500':'text-blue-500'}`}>
                            {tx.type==='expense'?'-':tx.type==='income'?'+':''}{formatCurrency(tx.amount).replace(',00','')}
                        </span>
                        <div className="flex gap-2 mt-2">
                            <button onClick={()=>{setForms(p=>({...p, transaction:{...tx}})); setActiveModal('transaction');}} className="p-1.5 bg-slate-100 text-slate-900 rounded-full"><Edit3 size={14}/></button>
                            <button onClick={()=>deleteTransaction(tx.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-full"><Trash2 size={14}/></button>
                        </div>
                    </div>
                </div>
            ))}
            {transactions.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-10">Tidak ada riwayat transaksi</p>
            )}
        </div>
    </div>
  );
}