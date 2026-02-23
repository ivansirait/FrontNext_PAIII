import { Truck, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

export default function NavbarSupir() {
  return (
    <nav className="bg-[#2D5A27] p-4 flex justify-between items-center shadow-md sticky top-0 z-50 text-white">
      <div className="flex items-center gap-2 ml-4 font-bold text-lg">
        <Truck size={24} /> <span>Driver CleanCity</span>
      </div>
      <div className="flex items-center gap-4 mr-4">
        <Link href="/" className="bg-[#3D733D] p-2 rounded-xl hover:bg-[#4D834D] transition">
          <Home size={18} />
        </Link>
        <button onClick={() => window.location.href = '/'} className="bg-red-500 hover:bg-red-600 p-2 rounded-xl transition">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}