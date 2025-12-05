import React from 'react';
import { Sparkles } from 'lucide-react';

// 1. MODAL MENABUNG (Saving)
export function SavingModal({ isOpen, onClose, forms, updateForm, handleAddSaving, accounts }) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
        <div className="bg-white w-full rounded-[2rem] p-6 animate-bounce-in">
            <h3 className="font-bold mb-4">Menabung ke Impian</h3>
            <form onSubmit={handleAddSaving} className="space-y-4">
                <select className="w-full bg-slate-50 p-3 rounded-xl font-bold" value={forms.saving.accountId} onChange={e => updateForm('saving', 'accountId', e.target.value)}>
                    {accounts.map(a => <option key={a.id} value={a.id}>Sumber: {a.name}</option>)}
                </select>
                <input className="w-full bg-slate-50 p-3 rounded-xl font-bold" type="number" placeholder="Jumlah" value={forms.saving.amount} onChange={e => updateForm('saving', 'amount', e.target.value)} autoFocus />
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold">Batal</button>
                    <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan</button>
                </div>
            </form>
        </div>
    </div>
  );
}

// 2. MODAL BAYAR HUTANG (PayDebt)
export function PayDebtModal({ isOpen, onClose, forms, updateForm, handlePayDebt, accounts }) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
        <div className="bg-white w-full rounded-[2rem] p-6 animate-bounce-in">
            <h3 className="font-bold mb-4">Bayar Hutang/Cicilan</h3>
            <form onSubmit={handlePayDebt} className="space-y-4">
                <select className="w-full bg-slate-50 p-3 rounded-xl font-bold" value={forms.payDebt.accountId} onChange={e => updateForm('payDebt', 'accountId', e.target.value)}>
                    {accounts.map(a => <option key={a.id} value={a.id}>Sumber: {a.name}</option>)}
                </select>
                <input className="w-full bg-slate-50 p-3 rounded-xl font-bold" type="number" placeholder="Jumlah" value={forms.payDebt.amount} onChange={e => updateForm('payDebt', 'amount', e.target.value)} autoFocus />
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold">Batal</button>
                    <button className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl">Bayar</button>
                </div>
            </form>
        </div>
    </div>
  );
}

// 3. MODAL TARIK IMPIAN (WithdrawGoal)
export function WithdrawGoalModal({ isOpen, onClose, forms, updateForm, handleWithdrawSaving, accounts }) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
        <div className="bg-white w-full rounded-[2rem] p-6 animate-bounce-in">
            <h3 className="font-bold mb-4">Tarik Saldo Impian</h3>
            <form onSubmit={handleWithdrawSaving} className="space-y-4">
                <select className="w-full bg-slate-50 p-3 rounded-xl font-bold" value={forms.withdrawGoal.accountId} onChange={e => updateForm('withdrawGoal', 'accountId', e.target.value)}>
                    {accounts.map(a => <option key={a.id} value={a.id}>Masuk ke: {a.name}</option>)}
                </select>
                <input className="w-full bg-slate-50 p-3 rounded-xl font-bold" type="number" placeholder="Jumlah Penarikan" value={forms.withdrawGoal.amount} onChange={e => updateForm('withdrawGoal', 'amount', e.target.value)} autoFocus />
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold">Batal</button>
                    <button className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl">Tarik</button>
                </div>
            </form>
        </div>
    </div>
  );
}

// 4. MODAL AI (AIModal)
export function AIModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
        <div className="bg-white w-full rounded-[2rem] p-6 animate-bounce-in text-center">
            <Sparkles className="mx-auto text-indigo-500 mb-2" size={32}/>
            <h3 className="font-bold mb-2">Analisis AI</h3>
            <p className="text-sm text-slate-500 mb-4">"Keuanganmu stabil minggu ini! Pertahankan pengeluaran di bawah 50% pemasukan."</p>
            <button onClick={onClose} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold">OK, Mengerti</button>
        </div>
    </div>
  );
}