import React from 'react';
import { 
  User, Download, Upload, KeyRound, Trash2, LogOut, ChevronRight, Copy, Users 
} from 'lucide-react';

export default function AccountView({ 
  user,           
  walletId,       // <--- PROP BARU
  onJoinClick,    // <--- PROP BARU
  onExport,       
  onImport,       
  onChangePin,    
  onReset,        
  onLogout        
}) {
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletId);
    alert("ID Dompet disalin! Kirim ke pasanganmu.");
  };

  return (
    <div className="animate-fade-in space-y-6 pt-4">
        {/* Profile Header (TETAP SAMA) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Pengguna Premium</p>
                <h3 className="font-bold text-xl text-slate-800 truncate">{user.name}</h3>
            </div>
        </div>

        {/* --- BAGIAN BARU: FAMILY SYNC --- */}
        <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={64}/></div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Users size={20}/> Sinkronisasi Keluarga</h3>
            <p className="text-indigo-100 text-xs mb-4 max-w-[80%]">Bagikan ID ini ke pasanganmu agar data keuangan kalian terhubung realtime.</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/20 mb-3">
                <code className="text-xs font-mono truncate max-w-[200px]">{walletId || 'Loading...'}</code>
                <button onClick={copyToClipboard} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Copy size={16}/></button>
            </div>

            <button onClick={onJoinClick} className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl text-sm shadow-sm active:scale-95 transition-transform">
                Gabung ke Dompet Lain
            </button>
        </div>
        {/* -------------------------------- */}

        {/* Menu Actions (TETAP SAMA, HANYA EXPORT/IMPORT DIHAPUS KARENA SUDAH CLOUD) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Fitur Backup Manual mungkin sudah tidak relevan di Cloud, tapi biarkan saja kalau mau */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-50" onClick={onChangePin}>
                <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><KeyRound size={20}/></div><span className="font-semibold text-sm text-slate-700">Ubah PIN</span></div>
                <ChevronRight size={18} className="text-slate-300"/>
            </div>

            {/* Logout */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-rose-600" onClick={onLogout}>
                <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><LogOut size={20}/></div><span className="font-semibold text-sm">Keluar Akun</span></div>
            </div>
        </div>
        
        <p className="text-center text-xs text-slate-300 pb-4">ID: {user.email}</p>
    </div>
  );
}