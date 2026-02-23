"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarSupir from './components/NavbarSupir';
import TugasCard from './components/TugasCard';
import LoginFormSupir from './components/LoginFormSupir'; // Pastikan sudah dibuat
import { Truck, ClipboardList, CheckCircle, Clock, Map as MapIcon, BarChart3, User } from 'lucide-react';

export default function HalamanSupir() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driverData, setDriverData] = useState<any>(null);
  const [tugasList, setTugasList] = useState([]);
  const [stats, setStats] = useState({ baru: 0, proses: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch diletakkan di luar conditional return
  const fetchTugas = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/laporan');
      const allData = res.data;

      setStats({
        baru: allData.filter((l: any) => l.status === 'BARU').length,
        proses: allData.filter((l: any) => l.status === 'DITINDAKLANJUTI').length,
        selesai: allData.filter((l: any) => l.status === 'SELESAI').length,
      });

      const filterTugas = allData.filter((l: any) => l.status === 'DITINDAKLANJUTI');
      setTugasList(filterTugas);
    } catch (err) {
      console.error("Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetch hanya jika sudah login
  useEffect(() => {
    if (isLoggedIn) {
      fetchTugas();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDriverData(null);
  };

  const handleSelesai = async (id: string) => {
    if (confirm("Konfirmasi: Sampah di lokasi ini sudah benar-benar diangkut?")) {
      try {
        await axios.patch(`http://localhost:5000/laporan/${id}`, { status: "SELESAI" });
        alert("Status berhasil diperbarui ke SELESAI");
        fetchTugas(); 
      } catch (err) {
        alert("Gagal update status");
      }
    }
  };

  // LOGIKA TAMPILAN: Jika belum login, tampilkan LoginForm
  if (!isLoggedIn) {
    return (
      <LoginFormSupir 
        onLoginSuccess={(data: any) => {
          setDriverData(data);
          setIsLoggedIn(true);
        }} 
      />
    );
  }

  // JIKA SUDAH LOGIN, TAMPILKAN DASHBOARD
  return (
    <main className="min-h-screen bg-[#FDFCF0]">
      <NavbarSupir onLogout={handleLogout} />

      <div className="max-w-xl mx-auto py-6 px-5">
        {/* Nama Driver */}
        <div className="mb-6">
          <p className="text-slate-400 text-sm font-medium">Selamat Bekerja,</p>
          <h1 className="text-2xl font-black text-slate-800 uppercase">{driverData?.name || 'Driver'}</h1>
        </div>

        {/* SEKSI STATUS TUGAS */}
        <h2 className="font-bold text-slate-800 mb-4">Status Tugas Anda</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={<ClipboardList size={20}/>} count={stats.baru} label="Baru" color="orange" />
          <StatCard icon={<Clock size={20}/>} count={stats.proses} label="Proses" color="blue" />
          <StatCard icon={<CheckCircle size={20}/>} count={stats.selesai} label="Selesai" color="green" />
        </div>

        {/* SEKSI FITUR UTAMA */}
        <h2 className="font-bold text-slate-800 mb-4">Fitur Utama</h2>
        <div className="grid grid-cols-4 gap-4 mb-10">
          <MenuIcon icon={<ClipboardList className="text-green-700"/>} label="Daftar Tugas" active />
          <MenuIcon icon={<CheckCircle className="text-green-700"/>} label="Riwayat" />
          <MenuIcon icon={<MapIcon className="text-green-700"/>} label="Peta Lokasi" />
          <MenuIcon icon={<Clock className="text-green-700"/>} label="Status" />
          <MenuIcon icon={<BarChart3 className="text-green-700"/>} label="Statistik" />
          <MenuIcon icon={<User className="text-green-700"/>} label="Profil" />
        </div>

        {/* DAFTAR TUGAS AKTIF */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-800">Tugas Penjemputan</h2>
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">
                {tugasList.length} Lokasi
            </span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400 animate-pulse font-bold">Memuat Tugas...</div>
        ) : tugasList.length > 0 ? (
          <div className="grid gap-4">
            {tugasList.map((item: any) => (
              <TugasCard key={item.id} item={item} onSelesai={handleSelesai} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[30px] p-10 text-center border-2 border-dashed border-slate-200">
            <Truck size={40} className="mx-auto mb-2 text-slate-200" />
            <p className="text-slate-400 text-sm font-bold">Tidak ada tugas aktif.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Komponen Pendukung agar kode utama bersih
function StatCard({ icon, count, label, color }: any) {
  const colors: any = {
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600"
  };
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
      <div className={`${colors[color]} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-xl font-black text-slate-800">{count}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
    </div>
  );
}

function MenuIcon({ icon, label, active = false }: any) {
    return (
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-green-100 border-2 border-green-500' : 'bg-green-50 hover:bg-green-100'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{label}</span>
        </div>
    )   
}