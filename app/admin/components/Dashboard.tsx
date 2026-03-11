"use client";
import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Truck, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface DashboardProps {
  laporanList: any[];
  posts: any[];
  galleries: any[];
}

export default function Dashboard({ laporanList, posts, galleries }: DashboardProps) {
  const [stats, setStats] = useState({
    totalLaporan: 0,
    laporanSelesai: 0,
    laporanDiproses: 0,
    laporanPending: 0,
    totalTruk: 0,
    trukAktif: 0
  });
  
  const [grafikData, setGrafikData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data statistik dari API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setStats(res.data.data.cards);
          
          // Format data grafik
          const formattedGrafik = res.data.data.grafik.map((item: any) => ({
            hari: new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'short' }),
            laporan: Number(item.total)
          }));
          setGrafikData(formattedGrafik);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Data statistik dari laporan (sudah ada)
  const totalLaporan = laporanList.length;
  const laporanSelesai = laporanList.filter(l => l.status === 'SELESAI').length;
  const laporanProses = laporanList.filter(l => l.status === 'DIPROSES' || l.status === 'DITINDAKLANJUTI').length;
  const laporanPending = laporanList.filter(l => l.status === 'PENDING').length;
  
  // Persentase
  const persentaseSelesai = totalLaporan ? Math.round((laporanSelesai / totalLaporan) * 100) : 0;
  const persentaseProses = totalLaporan ? Math.round((laporanProses / totalLaporan) * 100) : 0;

  // Data kinerja wilayah (dari props atau API)
  const kinerjaWilayah = [
    { nama: 'BALIGE', persentase: 92, status: 'baik' },
    { nama: 'LAGUBOTI', persentase: 78, status: 'baik' },
    { nama: 'PORSEA', persentase: 65, status: 'sedang' },
  ];

  // Jika loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang, Admin!</h1>
        <p className="text-green-100 text-sm">
          Berikut ringkasan operasional kebersihan Toba untuk hari ini.
        </p>
      </div>

      {/* 4 Card Statistik - PAKAI DATA REAL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Laporan Baru (Pending) */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm mb-1">Laporan Baru</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">{stats.laporanPending || 0}</p>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
              <ArrowUp size={12} className="mr-1" /> {persentaseProses}%
            </span>
          </div>
        </div>

        {/* Card 2: Selesai Hari Ini */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm mb-1">Selesai</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">{stats.laporanSelesai || 0}</p>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
              <ArrowUp size={12} className="mr-1" /> {persentaseSelesai}%
            </span>
          </div>
        </div>

        {/* Card 3: Dalam Proses */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm mb-1">Dalam Proses</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">{stats.laporanDiproses || 0}</p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Aktif
            </span>
          </div>
        </div>

        {/* Card 4: Truk Aktif */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm mb-1">Truk Aktif</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">
              {stats.trukAktif || 0}/{stats.totalTruk || 12}
            </p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Armada
            </span>
          </div>
        </div>
      </div>

      {/* Grafik dan Analisa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik 7 Hari */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Tren Laporan 7 Hari Terakhir</h3>
          <div className="h-64">
            {grafikData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grafikData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hari" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="laporan" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    dot={{ fill: '#16a34a', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Belum ada data grafik
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">Data 7 hari terakhir</p>
        </div>

        {/* Analisa Wilayah */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Kinerja Wilayah</h3>
          
          {/* Kinerja Wilayah - Top 3 */}
          <div className="space-y-4">
            {kinerjaWilayah.map((wilayah, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{wilayah.nama}</span>
                  <span className={`font-bold ${
                    wilayah.persentase > 80 ? 'text-green-600' :
                    wilayah.persentase > 60 ? 'text-yellow-600' : 'text-orange-600'
                  }`}>
                    {wilayah.persentase}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      wilayah.persentase > 80 ? 'bg-green-500' : 
                      wilayah.persentase > 60 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${wilayah.persentase}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Laporan */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Laporan</span>
              <span className="font-bold text-gray-800">{totalLaporan}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Truk Tersedia</span>
              <span className="font-bold text-gray-800">{stats.trukAktif}/{stats.totalTruk}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Laporan Masuk Terbaru */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Laporan Masuk Terbaru</h3>
        
        {laporanList.length > 0 ? (
          <div className="space-y-3">
            {laporanList.slice(0, 5).map((laporan: any) => (
              <div key={laporan.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{laporan.jenis_sampah || 'Laporan Sampah'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(laporan.created_at).toLocaleDateString('id-ID')} • {laporan.lokasi || 'Balige'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  laporan.status === 'SELESAI' ? 'bg-green-100 text-green-800' :
                  laporan.status === 'DIPROSES' ? 'bg-yellow-100 text-yellow-800' :
                  laporan.status === 'DITINDAKLANJUTI' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {laporan.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada laporan masuk</p>
            <p className="text-sm">Belum ada data laporan yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}