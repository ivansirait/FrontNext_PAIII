"use client";
import { FileText, CheckCircle, Clock, Truck, Newspaper, Image, Users } from 'lucide-react';
import Link from 'next/link';

interface DashboardProps {
  laporanList: any[];
  posts: any[];
  galleries: any[];
}

export default function Dashboard({ laporanList, posts, galleries }: DashboardProps) {
  const totalLaporan = laporanList.length;
  const laporanSelesai = laporanList.filter(l => l.status === 'SELESAI').length;
  const laporanProses = laporanList.filter(l => l.status === 'DIPROSES').length;
  const laporanPending = laporanList.filter(l => l.status === 'PENDING').length;

  const stats = [
    { label: 'Total Laporan', value: totalLaporan, icon: FileText, color: 'bg-blue-500' },
    { label: 'Selesai', value: laporanSelesai, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Diproses', value: laporanProses, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Pending', value: laporanPending, icon: Clock, color: 'bg-red-500' },
  ];

  const contentStats = [
    { label: 'Total Berita', value: posts.length, icon: Newspaper, color: 'bg-purple-500', link: '/admin?menu=berita' },
    { label: 'Total Galeri', value: galleries.length, icon: Image, color: 'bg-indigo-500', link: '/admin?menu=galeri' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin!</h1>
        <p className="text-green-100">Kelola laporan warga, berita, dan galeri kegiatan di sini.</p>
      </div>

      {/* Stats Grid - Laporan */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Laporan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Grid - Konten Homepage */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Konten Homepage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contentStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link 
                key={index} 
                href={stat.link}
                className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              >
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Laporan Terbaru</h3>
          <div className="space-y-3">
            {laporanList.slice(0, 5).map((laporan: any) => (
              <div key={laporan.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium text-gray-800">{laporan.jenis_sampah || 'Laporan'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(laporan.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  laporan.status === 'SELESAI' ? 'bg-green-100 text-green-800' :
                  laporan.status === 'DIPROSES' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {laporan.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Berita Terbaru</h3>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post: any) => (
              <div key={post.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium text-gray-800">{post.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {post.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}