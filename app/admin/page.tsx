"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import Komponen
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LaporanCard from './components/LaporanCard';
import LoginForm from './components/LoginForm';
import AddOperatorForm from "./components/AddOperatorForm"; // Komponen baru kita

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [laporanList, setLaporanList] = useState([]);

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "sampah123";

  const fetchLaporan = async () => {
    try {
      const res = await axios.get('http://localhost:5000/laporan');
      setLaporanList(res.data);
    } catch (err) { console.error("Gagal mengambil data"); }
  };

  useEffect(() => {
    if (isLoggedIn) fetchLaporan();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === ADMIN_USER && credentials.password === ADMIN_PASS) {
      setIsLoggedIn(true);
    } else { alert("Username atau Password salah!"); }
  };

  const updateStatus = async (id: string, statusBaru: string) => {
    try {
      await axios.patch(`http://localhost:5000/laporan/${id}`, { status: statusBaru });
      fetchLaporan();
    } catch (err) { alert("Gagal update status"); }
  };

  const deleteLaporan = async (id: string) => {
    if (window.confirm("Hapus laporan ini secara permanen?")) {
      try {
        await axios.delete(`http://localhost:5000/laporan/${id}`);
        fetchLaporan();
        alert("Berhasil dihapus");
      } catch (err) { alert("Gagal menghapus"); }
    }
  };

  if (!isLoggedIn) {
    return <LoginForm credentials={credentials} setCredentials={setCredentials} onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-[#FDFCF0]">
      {/* Pastikan di dalam Navbar.tsx kamu menambahkan tombol untuk setActiveMenu('supir') */}
      <Navbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={() => setIsLoggedIn(false)} />

      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Konten Dashboard */}
        {activeMenu === 'dashboard' && <Dashboard laporanList={laporanList} />}

        {/* Menu Tambah Supir (BARU) */}
        {activeMenu === 'supir' && (
          <div className="max-w-md mx-auto">
            <AddOperatorForm />
          </div>
        )}

        {/* Konten Daftar Laporan */}
        {activeMenu === 'daftar' && (
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-slate-700">Laporan Baru & Proses</h2>
            {laporanList.filter((l:any) => l.status !== 'SELESAI').map((item:any) => (
              <LaporanCard key={item.id} item={item} onUpdate={updateStatus} />
            ))}
          </div>
        )}

        {/* Konten Riwayat */}
        {activeMenu === 'riwayat' && (
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-slate-700">Arsip Laporan Selesai</h2>
            {laporanList.filter((l:any) => l.status === 'SELESAI').map((item:any) => (
              <LaporanCard key={item.id} item={item} showDelete={true} onDelete={deleteLaporan} onUpdate={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}