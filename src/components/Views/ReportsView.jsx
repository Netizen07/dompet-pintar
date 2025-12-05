import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ReportsView({ monthlyStats, last7DaysStats, maxDailyExpense, budgets }) {
  return (
    <div className="animate-fade-in space-y-6 pt-2">
      {/* Arus Kas */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl mb-6">
        <h3 className="text-sm font-bold text-slate-300 mb-4">Arus Kas Bulan Ini</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400"><TrendingUp size={18}/></div><span>Pemasukan</span></div><span className="font-bold">{formatCurrency(monthlyStats.income)}</span></div>
          <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-2 bg-rose-500/20 rounded-xl text-rose-400"><TrendingDown size={18}/></div><span>Pengeluaran</span></div><span className="font-bold">{formatCurrency(monthlyStats.expense)}</span></div>
          <div className="h-px bg-slate-700 my-2"></div>
          <div className="flex justify-between items-center"><span className="text-slate-400">Netto (Sisa)</span><span className={`font-bold text-lg ${(monthlyStats.income - monthlyStats.expense) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(monthlyStats.income - monthlyStats.expense)}</span></div>
        </div>
      </div>
      
      {/* Grafik 7 Hari */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-6 text-sm">Pengeluaran 7 Hari Terakhir</h3>
        <div className="flex gap-2 items-end h-40 w-full justify-between">
            {last7DaysStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end justify-center" style={{height:'100%'}}>
                        <div className="w-full mx-1 bg-indigo-500 rounded-t-md" style={{height:`${(stat.amount / maxDailyExpense) * 100}%`}}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{stat.day}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Analisis Kategori */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4 text-sm">Analisis Kategori</h3>
          {budgets.map(b=>(
              <div key={b.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-600 flex items-center gap-2">{b.icon} {b.name}</span><span className="text-slate-400">{Math.round((b.spent/b.limit)*100)}%</span></div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className={`h-full ${b.color}`} style={{width:`${Math.min((b.spent/b.limit)*100,100)}%`}}></div></div>
              </div>
          ))}
      </div>
    </div>
  );
}