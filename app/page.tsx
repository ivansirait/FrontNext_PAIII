"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Trash2, Camera, Newspaper, Mail, Instagram, Facebook, ArrowRight, ChevronRight, MapPin, Phone, Clock, ShieldCheck, Leaf, Users } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, galleriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/posts'),
          axios.get('http://localhost:5000/api/galleries')
        ]);
        setPosts(postsRes.data.slice(0, 3));
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
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900">
      
      {/* NAVBAR - Added Glassmorphism */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl px-6 md:px-8 h-20 flex justify-between items-center border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <img src="/dlh.png" alt="Logo DLH Toba" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <h1 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight">
                Dinas Lingkungan Hidup
              </h1>
              <p className="text-[10px] md:text-xs text-green-600 font-bold tracking-widest uppercase">Kabupaten Toba</p>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-8 font-semibold text-slate-600">
            {['Tentang', 'Berita', 'Galeri', 'Visi', 'Kontak'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-green-600 transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-slate-600 hover:text-green-600 font-bold px-4">
              Login
            </Link>
            <Link href="/login" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-95">
              Lapor!
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Fixed Overlay & Layout */}
      <header className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Background Toba"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/30 px-4 py-2 rounded-full mb-6">
              <Leaf size={16} className="text-green-400" />
              <span className="text-xs md:text-sm font-bold tracking-wider uppercase">Lestari Alam, Indah Toba</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
              Menjaga Kebersihan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Tanah Toba
              </span>
            </h1>
            <p className="text-lg md:text-xl font-medium opacity-90 mb-10 leading-relaxed max-w-xl">
              Sinergi pemerintah dan masyarakat dalam mewujudkan lingkungan yang asri, bersih, dan berkelanjutan untuk generasi mendatang.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2">
                Pelajari Program <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

       {/* TENTANG SECTION - Better Spacing */}
      <section id="tentang" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 right-12 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white p-4 rounded-[2rem] shadow-2xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800" 
                  className="rounded-[1.5rem] w-full h-[400px] object-cover" 
                  alt="Environmental"
                />
              </div>
            </div>
            <div>
              <span className="text-green-600 font-bold tracking-[0.2em] text-xs uppercase">Profil Lembaga</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-8">About <span className="text-green-600 underline decoration-green-200 underline-offset-8">DLH Toba</span></h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                DLH Toba berkomitmen memberikan layanan terbaik melalui inovasi pengelolaan lingkungan. Kami mengintegrasikan teknologi modern dengan kearifan lokal untuk menjaga ekosistem Danau Toba.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600"><MapPin size={24}/></div>
                  <div><h4 className="font-bold text-slate-800">Cakupan Wilayah</h4><p className="text-sm text-slate-500">Seluruh kecamatan di Kabupaten Toba</p></div>
                </div>
                <div className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Clock size={24}/></div>
                  <div><h4 className="font-bold text-slate-800">Pelayanan 24/7</h4><p className="text-sm text-slate-500">Siaga pelaporan gangguan lingkungan</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI - Grid Modernization */}
      <section id="visi" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900">Arah Strategis Kami</h2>
            <div className="h-1.5 w-24 bg-green-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="group bg-slate-900 p-10 rounded-[2.5rem] text-white hover:shadow-2xl hover:shadow-green-900/20 transition-all duration-500">
              <span className="text-6xl font-black opacity-20 group-hover:opacity-40 transition-opacity italic">Visi</span>
              <p className="text-2xl font-medium leading-relaxed mt-4 italic text-green-50">
                "Mewujudkan Kabupaten Toba yang asri dan berkelanjutan melalui tata kelola lingkungan yang cerdas dan partisipatif."
              </p>
            </div>
            <div className="bg-green-50 p-10 rounded-[2.5rem] border border-green-100">
              <span className="text-xs font-black text-green-600 uppercase tracking-widest">Misi Kami</span>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 mb-6">Langkah Nyata</h3>
              <div className="space-y-4">
                {[
                  "Transformasi pengolahan sampah berbasis komunitas",
                  "Restorasi ekosistem hutan dan daerah aliran sungai",
                  "Edukasi digital sadar lingkungan untuk milenial"
                ].map((misi, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <ChevronRight size={14} className="text-white" />
                    </div>
                    <p className="text-slate-700 font-medium">{misi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BERITA SECTION */}
      <section id="berita" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-600 font-bold tracking-widest text-sm">INFORMASI TERKINI</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2">Berita <span className="text-green-600">Terbaru</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
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
        </div>
      </section>

      {/* GALERI SECTION */}
      <section id="galeri" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-600 font-bold tracking-widest text-sm">DOKUMENTASI</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2">Galeri <span className="text-green-600">Kegiatan</span></h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse"></div>
              ))
            ) : galleries.length > 0 ? (
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
              [1,2,3,4].map(i => (
                <div key={i} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={`https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=300`} 
                      alt={`Galeri ${i}`}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

   

      {/* FOOTER */}
      <footer id="kontak" className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Trash2 className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold">DLH Toba</span>
              </div>
              <p className="text-slate-400 text-sm">
                Dinas Lingkungan Hidup Kabupaten Toba berkomitmen untuk menjaga kelestarian alam dan kebersihan lingkungan.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#tentang" className="hover:text-green-400">Tentang</Link></li>
                <li><Link href="#berita" className="hover:text-green-400">Berita</Link></li>
                <li><Link href="#galeri" className="hover:text-green-400">Galeri</Link></li>
                <li><Link href="#visi" className="hover:text-green-400">Visi Misi</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Sumber Daya</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/perda" className="hover:text-green-400">Perda Lingkungan</Link></li>
                <li><Link href="/jadwal" className="hover:text-green-400">Jadwal Angkut</Link></li>
                <li><Link href="/laporan" className="hover:text-green-400">Laporan Tahunan</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin size={18} className="text-green-500 flex-shrink-0 mt-1" />
                  <span>Jl. Sisingamangaraja No. 12, Balige, Toba 22312</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={18} className="text-green-500" />
                  <span>(0632) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={18} className="text-green-500" />
                  <span>dlh@tobakab.go.id</span>
                </li>
              </ul>
              
              <div className="flex gap-4 mt-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-1 text-center text-slate-200 text-sm">
            <p>© 2024 Dinas Lingkungan Hidup Kabupaten Toba. Seluruh hak cipta dilindungi.</p>
            <p className="mt-2">
              <Link href="/privasi" className="hover:text-green-400 mx-2">Kebijakan Privasi</Link> • 
              <Link href="/syarat" className="hover:text-green-400 mx-2">Syarat & Ketentuan</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}