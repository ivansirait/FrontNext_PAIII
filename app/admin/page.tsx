"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import Komponen
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LaporanCard from './components/LaporanCard';
import LoginForm from './components/LoginForm';
import AddOperatorForm from "./components/AddOperatorForm"; 
import ManagePosts from './components/ManagePosts';
import ManageGalleries from './components/ManageGalleries';
import ManageSupir from './components/ManageSupir';
import ManageTruk from './components/ManageTruk';
import PetaSampah from './components/PetaSampah';
import ManageWilayah from './components/ManageWilayah';
import ManagePenugasan from './components/ManagePenugasan';


export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [laporanList, setLaporanList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cek token saat halaman dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token di AdminPage:', token ? 'Ada' : 'Tidak ada');
    
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fungsi untuk mendapatkan konfigurasi dengan token
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fungsi ambil data Laporan
  const fetchLaporan = async () => {
    try {
      const config = getAuthConfig();
      const res = await axios.get('http://localhost:5000/api/laporan', config);
      setLaporanList(res.data);
    } catch (err: any) { 
      console.error("Gagal mengambil data laporan", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Fungsi ambil data Berita
  const fetchPosts = async () => {
    try {
      const config = getAuthConfig();
      const res = await axios.get('http://localhost:5000/api/posts', config);
      setPosts(res.data);
    } catch (err: any) { 
      console.error("Gagal mengambil data berita", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Fungsi ambil data Galeri
  const fetchGalleries = async () => {
    try {
      const config = getAuthConfig();
      const res = await axios.get('http://localhost:5000/api/galleries', config);
      setGalleries(res.data);
    } catch (err: any) { 
      console.error("Gagal mengambil data galeri", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLaporan();
      fetchPosts();
      fetchGalleries();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: credentials.username,
        password: credentials.password
      });

      if (res.data.success && res.data.token) {
        // Simpan token
        localStorage.setItem('token', res.data.token);
        console.log('Token tersimpan:', res.data.token.substring(0, 20) + '...');
        
        setIsLoggedIn(true);
        alert(`Selamat datang kembali, ${res.data.user?.fullName || 'Admin'}!`);
      } else {
        alert('Login gagal: Token tidak diterima');
      }
    } catch (err: any) {
      const pesanError = err.response?.data?.message || "Gagal terhubung ke server";
      alert(pesanError);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setActiveMenu('dashboard');
  };

  const updateStatus = async (id: string, statusBaru: string) => {
    try {
      const config = getAuthConfig();
      await axios.patch(`http://localhost:5000/api/laporan/${id}`, { status: statusBaru }, config);
      fetchLaporan();
    } catch (err) { 
      alert("Gagal update status"); 
    }
  };

  const deleteLaporan = async (id: string) => {
    if (window.confirm("Hapus laporan ini secara permanen?")) {
      try {
        const config = getAuthConfig();
        await axios.delete(`http://localhost:5000/api/laporan/${id}`, config);
        fetchLaporan();
        alert("Berhasil dihapus");
      } catch (err) { alert("Gagal menghapus"); }
    }
  };

  // Render konten berdasarkan activeMenu
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard laporanList={laporanList} posts={posts} galleries={galleries} />;
     
     case 'peta-sampah':
        return <PetaSampah />;

        // Di dalam switch activeMenu
case 'penugasan':
  return <ManagePenugasan />;


      case 'daftar':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Laporan Baru & Proses</h2>
            <div className="grid gap-6">
              {laporanList.filter((l: any) => l.status !== 'SELESAI').map((item: any) => (
                <LaporanCard key={item.id} item={item} onUpdate={updateStatus} />
              ))}
            </div>
          </div>
        );
      
      case 'riwayat':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Arsip Laporan Selesai</h2>
            <div className="grid gap-6">
              {laporanList.filter((l: any) => l.status === 'SELESAI').map((item: any) => (
                <LaporanCard 
                  key={item.id} 
                  item={item} 
                  showDelete={true} 
                  onDelete={deleteLaporan} 
                  onUpdate={updateStatus} 
                />
              ))}
            </div>
          </div>
        );
      
      // case 'supir':
      //   return (
      //     <div className="max-w-md mx-auto">
      //       <AddOperatorForm />
      //     </div>
      //   );
      
    case 'data-supir':
        return <ManageSupir />;

          
    case 'data-truk':
      return <ManageTruk />; 
      
    case 'data-wilayah':
       return <ManageWilayah />;
  
      // <-- TAMBAHKAN: Case untuk Data Wilayah (sementara)
      // case 'data-wilayah':
      //   return (
      //     <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      //       <h2 className="text-2xl font-bold text-gray-800 mb-2">Halaman Data Wilayah</h2>
      //       <p className="text-gray-500">Sedang dalam pengembangan</p>
      //     </div>
      //   );
      
      // <-- TAMBAHKAN: Case untuk Aktif/Nonaktif Kecamatan (sementara)
      case 'aktif-kecamatan':
        return (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Halaman Aktif/Nonaktif Kecamatan</h2>
            <p className="text-gray-500">Sedang dalam pengembangan</p>
          </div>
        );
      
      case 'berita':
        return <ManagePosts posts={posts} onPostsUpdate={fetchPosts} />;
      
      case 'galeri':
        return <ManageGalleries galleries={galleries} onGalleriesUpdate={fetchGalleries} />;
      
      default:
        return <Dashboard laporanList={laporanList} posts={posts} galleries={galleries} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginForm 
      credentials={credentials} 
      setCredentials={setCredentials} 
      onLogin={handleLogin}
      loading={loading}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        onLogout={handleLogout}
      />
      <main className="md:ml-72 min-h-screen transition-all duration-300">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

