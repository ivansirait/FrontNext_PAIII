"use client";
import Link from 'next/link';
import { Trash2, User, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-6">
      {/* Header Logo */}
      <div className="text-center mb-12">
        <div className="bg-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-green-200 mb-4">
          <Trash2 size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Clean<span className="text-green-600">City</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Sistem Informasi Pengelolaan Sampah Terintegrasi</p>
      </div>

      {/* Pilihan Akses - Link ke folder masing-masing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Tombol ke halaman WARGA */}
        <Link href="/Warga" className="group cursor-pointer">
          <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="bg-blue-50 p-5 rounded-2xl group-hover:bg-blue-600 transition-colors mb-4">
              <User size={32} className="text-blue-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Warga</h2>
            <p className="text-slate-500 text-sm mt-2">Laporkan tumpukan sampah liar di sekitar Anda.</p>
          </div>
        </Link>

        {/* Tombol ke halaman SUPIR */}
        <Link href="/Supir" className="group cursor-pointer">
          <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="bg-orange-50 p-5 rounded-2xl group-hover:bg-orange-600 transition-colors mb-4">
              <Truck size={32} className="text-orange-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Supir / Driver</h2>
            <p className="text-slate-500 text-sm mt-2">Lihat lokasi penjemputan dan selesaikan tugas.</p>
          </div>
        </Link>

        {/* Tombol ke halaman ADMIN */}
        <Link href="/admin" className="group cursor-pointer">
          <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="bg-green-50 p-5 rounded-2xl group-hover:bg-green-600 transition-colors mb-4">
              <ShieldCheck size={32} className="text-green-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Administrator</h2>
            <p className="text-slate-500 text-sm mt-2">Kelola laporan dan pantau statistik kota.</p>
          </div>
        </Link>

      </div>
    </main>
  );
}

