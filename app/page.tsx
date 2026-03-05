"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Trash2, Camera, Newspaper, Mail, Instagram, Facebook, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // FETCH BERITA
        const postsRes = await axios.get('http://localhost:5000/api/posts');
        console.log('Data berita:', postsRes.data); // CEK DI CONSOLE
        setPosts(postsRes.data.slice(0, 3));
        
        // FETCH GALERI
        const galleriesRes = await axios.get('http://localhost:5000/api/galleries');
        console.log('Data galeri:', galleriesRes.data); // CEK DI CONSOLE
        setGalleries(galleriesRes.data.slice(0, 4));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trash2 className="text-green-600" size={28} />
            <span className="text-2xl font-black text-slate-800">Clean<span className="text-green-600">City</span></span>
          </div>
          <div className="hidden md:flex gap-8 font-bold text-slate-600">
            <Link href="#profil" className="hover:text-green-600">Profil</Link>
            <Link href="#berita" className="hover:text-green-600">Berita</Link>
            <Link href="#galeri" className="hover:text-green-600">Galeri</Link>
          </div>
          <Link href="/Warga" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700">Lapor!</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-green-50 to-white">
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6">
          Bersama Wujudkan<br/><span className="text-green-600">Kota Tanpa Sampah</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-500 text-lg mb-8">
          Platform kolaborasi warga dan pemerintah untuk pengelolaan sampah yang lebih cerdas dan transparan.
        </p>
      </header>

      {/* BERITA SECTION */}
      <section id="berita" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-10">
          <Newspaper className="text-green-600" size={32} />
          <h2 className="text-3xl font-bold text-slate-800">Berita Terbaru</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton untuk berita
            [1,2,3].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                  <div className="h-6 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all">
                <div className="h-48 bg-slate-200 overflow-hidden">
                  <img 
                    src={post.imageUrl || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=500"} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{post.category || 'BERITA'}</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-2 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">{post.content}</p>
                  <Link 
                    href={`/berita/${post.slug || post.id}`}
                    className="flex items-center gap-2 text-green-600 font-bold text-sm hover:gap-3 transition-all"
                  >
                    Baca Selengkapnya <ArrowRight size={16}/>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-500">
              Belum ada berita
            </div>
          )}
        </div>
      </section>

      {/* GALERI SECTION - KHUSUS GAMBAR */}
      <section id="galeri" className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="flex items-center gap-3 mb-10">
          <Camera className="text-green-600" size={32} />
          <h2 className="text-3xl font-bold text-slate-800">Dokumentasi Aktivitas</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton untuk galeri
            [1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse"></div>
            ))
          ) : galleries.length > 0 ? (
            // Tampilkan galeri dari database
            galleries.map((item: any) => (
              <div key={item.id} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || 'Galeri'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=300';
                    }}
                  />
                </div>
                {item.title && (
                  <p className="mt-2 text-sm text-center text-gray-600">{item.title}</p>
                )}
              </div>
            ))
          ) : (
            // Fallback GAMBAR, BUKAN BERITA
            [1,2,3,4].map(i => (
              <div key={i} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={`https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=300&i=${i}`} 
                    alt={`Galeri ${i}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        {/* ... footer code ... */}
      </footer>
    </div>
  );
}