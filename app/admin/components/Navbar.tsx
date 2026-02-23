import { LayoutDashboard, ClipboardList, History, LogOut, User, UserPlus } from 'lucide-react';

export default function Navbar({ activeMenu, setActiveMenu, onLogout }: any) {
  return (
    <nav className="bg-[#3D733D] p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="flex gap-6 text-white ml-10">
        <button 
          onClick={() => setActiveMenu('dashboard')} 
          className={`flex items-center gap-2 font-medium transition ${activeMenu === 'dashboard' ? 'opacity-100 border-b-2 border-white' : 'opacity-70'}`}
        >
          <LayoutDashboard size={18}/> Dashboard
        </button>

        <button 
          onClick={() => setActiveMenu('daftar')} 
          className={`flex items-center gap-2 font-medium transition ${activeMenu === 'daftar' ? 'opacity-100 border-b-2 border-white' : 'opacity-70'}`}
        >
          <ClipboardList size={18}/> Daftar Laporan
        </button>

        <button 
          onClick={() => setActiveMenu('riwayat')} 
          className={`flex items-center gap-2 font-medium transition ${activeMenu === 'riwayat' ? 'opacity-100 border-b-2 border-white' : 'opacity-70'}`}
        >
          <History size={18}/> Riwayat
        </button>

        {/* MENU BARU: KELOLA SUPIR */}
        <button 
          onClick={() => setActiveMenu('supir')} 
          className={`flex items-center gap-2 font-medium transition ${activeMenu === 'supir' ? 'opacity-100 border-b-2 border-white' : 'opacity-70'}`}
        >
          <UserPlus size={18}/> Kelola Supir
        </button>
      </div>

      <div className="flex items-center gap-4 mr-10">
        <span className="text-white flex items-center gap-2 font-bold"><User size={18}/> Admin</span>
        <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition">
          <LogOut size={16}/> Logout
        </button>
      </div>
    </nav>
  );
}