import React from 'react';
import { 
  CheckCircle, ArrowRight, ChevronDown, Wallet, Tag, Calendar, FileText 
} from 'lucide-react';

export default function TransactionModal({ 
  isOpen, onClose, forms, updateForm, submitTransaction, data 
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40">
        <div onClick={onClose} className="absolute inset-0"></div>
        <div className={`w-full rounded-t-[2.5rem] p-6 shadow-2xl animate-slide-up relative z-10 transition-colors duration-500 ${forms.transaction.type==='expense'?'bg-rose-50':forms.transaction.type==='income'?'bg-emerald-50':'bg-blue-50'}`}>
            <div className="w-12 h-1 bg-slate-300/50 rounded-full mx-auto mb-6"></div>
            <form onSubmit={submitTransaction} className="space-y-6">
                
                {/* TABS TYPE */}
                <div className="bg-white/50 p-1 rounded-2xl flex relative shadow-sm border border-white/60">
                    {['expense','income','transfer'].map(t => (
                        <button key={t} type="button" onClick={()=>updateForm('transaction','type',t)} className={`flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all ${forms.transaction.type===t?'bg-white shadow-sm text-slate-800':'text-slate-400'}`}>
                            {t==='expense'?'Keluar':t==='income'?'Masuk':'Transfer'}
                        </button>
                    ))}
                </div>

                {/* INPUT JUMLAH */}
                <div className="text-center py-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-70">Nominal Transaksi</label>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className={`text-3xl font-bold ${forms.transaction.type==='expense'?'text-rose-500':forms.transaction.type==='income'?'text-emerald-500':'text-blue-500'}`}>Rp</span>
                        <input type="number" required autoFocus className={`w-56 text-5xl font-extrabold text-center outline-none bg-transparent border-b-2 transition-colors placeholder:text-slate-200 ${forms.transaction.type==='expense'?'text-rose-600 border-rose-200 focus:border-rose-500':forms.transaction.type==='income'?'text-emerald-600 border-emerald-200 focus:border-emerald-500':'text-blue-600 border-blue-200 focus:border-blue-500'}`} placeholder="0" value={forms.transaction.amount} onChange={e=>updateForm('transaction','amount',e.target.value)}/>
                    </div>
                </div>

                {/* INPUT DETAILS */}
                <div className="space-y-4">
                    {forms.transaction.type === 'transfer' ? (
                        <div className="flex items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Dari</label>
                                <div className="relative">
                                    <select className="w-full bg-transparent font-bold text-slate-700 outline-none appearance-none pr-4" value={forms.transaction.accountId} onChange={e=>updateForm('transaction','accountId',e.target.value)}>
                                        {data.accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-0 top-1 text-slate-400 pointer-events-none"/>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-blue-400"/>
                            <div className="flex-1 text-right">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Ke</label>
                                <div className="relative">
                                    <select className="w-full bg-transparent font-bold text-slate-700 outline-none appearance-none pr-4 text-right" dir="rtl" value={forms.transaction.targetAccountId} onChange={e=>updateForm('transaction','targetAccountId',e.target.value)}>
                                        {data.accounts.filter(a=>a.id!==forms.transaction.accountId).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute left-0 top-1 text-slate-400 pointer-events-none"/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Wallet size={10}/> Akun</label>
                                <div className="relative mt-1">
                                    <select className="w-full bg-transparent font-bold text-slate-700 outline-none appearance-none" value={forms.transaction.accountId} onChange={e=>updateForm('transaction','accountId',e.target.value)}>
                                        {data.accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-0 top-1 text-slate-400 pointer-events-none"/>
                                </div>
                            </div>
                            {forms.transaction.type === 'expense' ? (
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Tag size={10}/> Kategori</label>
                                    <div className="relative mt-1">
                                        <select className="w-full bg-transparent font-bold text-slate-700 outline-none appearance-none" value={forms.transaction.category} onChange={e=>updateForm('transaction','category',e.target.value)}>
                                            <option value="">Lainnya</option>
                                            {data.budgets.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-0 top-1 text-slate-400 pointer-events-none"/>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={10}/> Tanggal</label>
                                    <input type="date" className="w-full bg-transparent font-bold text-slate-700 outline-none mt-1" value={forms.transaction.date} onChange={e=>updateForm('transaction','date',e.target.value)}/>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <FileText size={18} className="text-slate-400"/>
                        <input type="text" className="flex-1 font-medium text-slate-700 outline-none placeholder:text-slate-300" placeholder="Catatan transaksi..." value={forms.transaction.note} onChange={e=>updateForm('transaction','note',e.target.value)}/>
                    </div>
                    
                    {forms.transaction.type === 'expense' && (
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <Calendar size={18} className="text-slate-400"/>
                            <input type="date" className="flex-1 font-medium text-slate-700 outline-none bg-transparent" value={forms.transaction.date} onChange={e=>updateForm('transaction','date',e.target.value)}/>
                        </div>
                    )}
                </div>

                <button type="submit" className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${forms.transaction.type==='expense'?'bg-rose-600 shadow-rose-200':forms.transaction.type==='income'?'bg-emerald-600 shadow-emerald-200':'bg-blue-600 shadow-blue-200'}`}>
                    <CheckCircle size={20}/> Simpan
                </button>
            </form>
        </div>
    </div>
  );
}