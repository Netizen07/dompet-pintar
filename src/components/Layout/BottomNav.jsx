import React from 'react';
import { Home, BarChart3, Plus, Calendar, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onAddClick }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 pb-2 pt-2 rounded-t-2xl shadow-sm">
      <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto">
        <NavButton icon={Home} label="Beranda" id="home" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton icon={BarChart3} label="Laporan" id="reports" activeTab={activeTab} onClick={setActiveTab} />
        
        {/* Tombol Plus Tengah */}
        <div className="relative flex justify-center items-center">
            <div className="absolute -top-12">
                <button onClick={onAddClick} className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 hover:scale-105 rounded-full text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform border-[6px] border-[#F8FAFC]">
                    <Plus size={32} strokeWidth={3} />
                </button>
            </div>
        </div>

        <NavButton icon={Calendar} label="Riwayat" id="history" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton icon={User} label="Akun" id="account" activeTab={activeTab} onClick={setActiveTab} />
      </div>
    </div>
  );
}

// Komponen kecil internal untuk tombol agar tidak berulang
const NavButton = ({ icon: Icon, label, id, activeTab, onClick }) => (
  <button onClick={() => onClick(id)} className={`flex flex-col items-center justify-center gap-1 py-2 transition-colors ${activeTab === id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);