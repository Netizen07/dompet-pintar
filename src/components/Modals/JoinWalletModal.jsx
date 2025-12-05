import React, { useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';

export default function JoinWalletModal({ isOpen, onClose, onJoin }) {
  const [targetId, setTargetId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetId.trim()) {
      onJoin(targetId.trim());
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-bounce-in">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <Users size={32}/>
                </div>
                <h3 className="font-bold text-xl text-slate-800">Gabung Dompet Keluarga</h3>
                <p className="text-sm text-slate-500 mt-2">Masukkan ID Dompet pasanganmu untuk menyatukan pencatatan keuangan.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 ml-2 uppercase">ID Dompet Pasangan</label>
                    <input 
                        className="w-full bg-slate-50 p-4 rounded-xl font-bold text-center border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-800 placeholder:text-slate-300" 
                        placeholder="Contoh: wallet_User123..." 
                        value={targetId} 
                        onChange={e => setTargetId(e.target.value)}
                        required
                    />
                </div>
                
                <div className="flex gap-2 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-colors">Batal</button>
                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        Gabung <ArrowRight size={18}/>
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}