import React from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowRightLeft, Target, BookOpen, PieChart, Sparkles, Edit3 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function HomeView({ 
  data, showBalance, setShowBalance, totalBalance, monthlyStats, 
  safeAccounts, setActiveTab, setActiveModal, setForms, setIsEditing 
}) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* 1. KARTU SALDO UTAMA */}
      <div className="relative w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-indigo-500/40 overflow-hidden">
          <div className="relative z-10 text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2 opacity-80"><span className="text-xs font-medium tracking-widest uppercase">Total Saldo</span><button onClick={() => setShowBalance(!showBalance)}>{showBalance ? <Eye size={14}/> : <EyeOff size={14}/>}</button></div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{showBalance ? formatCurrency(totalBalance) : 'Rp ••••••'}</h1>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10"><div className="flex items-center justify-center gap-1 text-emerald-300 mb-1"><TrendingUp size={12}/><span className="text-[10px] font-bold uppercase">Masuk</span></div><p className="text-sm font-bold">{showBalance ? formatCurrency(monthlyStats.income).replace(',00', '') : '•••'}</p></div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10"><div className="flex items-center justify-center gap-1 text-rose-300 mb-1"><TrendingDown size={12}/><span className="text-[10px] font-bold uppercase">Keluar</span></div><p className="text-sm font-bold">{showBalance ? formatCurrency(monthlyStats.expense).replace(',00', '') : '•••'}</p></div>
          </div>
      </div>

      {/* 2. LIST AKUN (DOMPET SAYA) */}
      <div>
          <div className="flex justify-between items-center mb-3 px-2"><h3 className="font-bold text-slate-800 text-lg">Dompet Saya</h3><button onClick={() => { setIsEditing(false); updateForm('account','id',''); setActiveModal('account'); }} className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">+ Tambah</button></div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-6 px-6">
              {safeAccounts.map(acc => (
                  <div key={acc.id} onClick={() => { setForms(p=>({...p, account: {...acc}})); setIsEditing(true); setActiveModal('account'); }} className={`cursor-pointer snap-center min-w-[160px] h-[100px] rounded-2xl shadow-sm border border-slate-100 p-4 relative overflow-hidden group flex flex-col justify-between hover:border-indigo-200 bg-gradient-to-br ${acc.color}`}>
                      <div className="flex justify-between items-start relative z-10">
                          <div className="flex items-center gap-2"><span className="text-2xl">{acc.icon}</span></div>
                          <div className="absolute top-0 right-0 bg-white/20 p-1.5 rounded-full z-20 shadow-sm backdrop-blur-sm"><Edit3 size={12} className="text-white font-bold"/></div>
                      </div>
                      <div className="text-white"><p className="text-[10px] font-bold uppercase truncate pr-4 opacity-80">{acc.name}</p><p className="text-sm font-bold truncate">{showBalance ? formatCurrency(acc.balance).replace('Rp','') : '•••'}</p></div>
                  </div>
              ))}
          </div>
      </div>

      {/* 3. MENU GRID */}
      <div className="grid grid-cols-4 gap-4 px-2">
          {[{id:'goals', icon:Target, label:'Impian', color:'text-purple-600 bg-purple-50 border-purple-100'}, {id:'debts', icon:BookOpen, label:'Hutang', color:'text-rose-600 bg-rose-50 border-rose-100'}, {id:'budgets', icon:PieChart, label:'Anggaran', color:'text-orange-600 bg-orange-50 border-orange-100'}, {id:'ai', icon:Sparkles, label:'AI', color:'text-indigo-600 bg-indigo-50 border-indigo-100'}].map(m => (
              <button key={m.id} onClick={() => m.id==='ai'?setActiveModal('ai'):setActiveTab(m.id)} className="flex flex-col items-center gap-2 group"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border ${m.color}`}><m.icon size={22}/></div><span className="text-[10px] font-bold text-slate-600">{m.label}</span></button>
          ))}
      </div>

      {/* 4. TRANSAKSI TERAKHIR */}
      <div className="pb-10">
          <h3 className="font-bold text-slate-800 text-lg mb-4 px-2">Transaksi Terakhir</h3>
          <div className="space-y-3">
              {(data.transactions || []).slice(0, 5).map((tx) => (
                  <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type==='expense'?'bg-rose-100 text-rose-500':tx.type==='income'?'bg-emerald-100 text-emerald-500':'bg-blue-100 text-blue-500'}`}>{tx.type==='expense'?<TrendingDown size={18}/>:tx.type==='income'?<TrendingUp size={18}/>:<ArrowRightLeft size={18}/>}</div><div><p className="font-bold text-slate-700 text-sm">{tx.note||tx.type}</p><p className="text-xs text-slate-400">{formatDate(tx.date)}</p></div></div>
                      <span className={`font-bold text-sm ${tx.type==='expense'?'text-rose-500':tx.type==='income'?'text-emerald-500':'text-blue-500'}`}>{tx.type==='expense'?'-':tx.type==='income'?'+':''}{formatCurrency(tx.amount).replace(',00','')}</span>
                  </div>
              ))}
              {(data.transactions || []).length === 0 && <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">Belum ada transaksi</div>}
          </div>
      </div>
    </div>
  );
}