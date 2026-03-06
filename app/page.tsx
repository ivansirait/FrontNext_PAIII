"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Trash2, Camera, Newspaper, Mail, Instagram, Facebook, ArrowRight, ChevronRight, MapPin, Phone, Clock } from 'lucide-react';

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
        console.log('Data berita:', postsRes.data);
        setPosts(postsRes.data.slice(0, 3));
        
        // FETCH GALERI
        const galleriesRes = await axios.get('http://localhost:5000/api/galleries');
        console.log('Data galeri:', galleriesRes.data);
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
      {/* NAVBAR - Sudah diperbaiki dan diletakkan di dalam return */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Trash2 className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-black text-slate-800">DLH<span className="text-green-600"> Toba</span></span>
              <p className="text-[10px] text-slate-500 -mt-1">Dinas Lingkungan Hidup</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 font-medium text-slate-600">
            <Link href="#tentang" className="hover:text-green-600">Tentang</Link>
            <Link href="#berita" className="hover:text-green-600">Berita</Link>
            <Link href="#galeri" className="hover:text-green-600">Galeri</Link>
            <Link href="#visi" className="hover:text-green-600">Visi Misi</Link>
            <Link href="#kontak" className="hover:text-green-600">Kontak</Link>
          </div>
          
          {/* Navbar Right - Login, Daftar, Lapor! */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium hidden sm:block">
              Login
            </Link>
            <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-full font-bold hover:bg-green-700 text-sm hidden sm:block">
              Daftar
            </Link>
            <Link href="/login" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 shadow-lg shadow-green-200">
              Lapor!
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Menjaga Kebersihan Tanah Toba */}
      <header className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
              #BersihToba2026
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-4">
              Menjaga Kebersihan<br/>
              <span className="text-green-600 relative">
                Tanah Toba
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C50 3 150 3 298 5" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-600 text-lg mb-8">
              Sharing bersama dengan orang tua dan anak-anak untuk mewujudkan 
              lingkungan yang bersih, sehat, dan berkelanjutan di Kabupaten Toba.
            </p>
            
            {/* Info Terbaru - 3 Card */}
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
              <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-2xl border border-green-100 text-left">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-bold text-slate-800">Varan Management Expansion</h3>
                <p className="text-sm text-slate-500 mt-1">Beliau adalah seorang pengusaha di tanah Toba, yang mengajak para pemilik untuk membangun sebuah taman hutan.</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 text-left">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-bold text-slate-800">Rancangan Pengadilan Sosial</h3>
                <p className="text-sm text-slate-500 mt-1">Beliau juga merupakan salah satu pengusaha sosial yang berusaha untuk meningkatkan kualitas hidup masyarakat Toba.</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border border-amber-100 text-left">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-amber-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-bold text-slate-800">Gunung Sinabung tahun 2024</h3>
                <p className="text-sm text-slate-500 mt-1">Beliau juga menjadi penasihat terhadap risiko geofisika dan kebencanaan lingkungan.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TENTANG DLH SECTION */}
      <section id="tentang" className="py-20 px-6 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-600 font-bold tracking-widest text-sm">PROFIL LEMBAGA</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2">About <span className="text-green-600">DLH Toba</span></h2>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-100">
            <p className="text-lg text-slate-700 leading-relaxed">
              Dengan menggunakan teknologi terbaru, <span className="font-bold text-green-600">DLH Toba</span> telah menjadi salah satu 
              penyedia pemanfaatan sumber daya alam yang terpercaya. Dengan berbagai layanan 
              seperti pengelolaan sampah terpadu, monitoring lingkungan, serta edukasi kebersihan, 
              DLH Toba berkomitmen untuk menjaga kelestarian alam Tanah Toba.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Wilayah Layanan</h3>
                  <p className="text-slate-600">9 Kecamatan di Kabupaten Toba dengan layanan pengangkutan sampah rutin.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Jam Operasional</h3>
                  <p className="text-slate-600">Senin - Sabtu, 08:00 - 18:00 WIB. Jumat: Gotong royong.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI SECTION */}
      <section id="visi" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-600 font-bold tracking-widest text-sm">ARAH TUJUAN</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2">Visi & Misi <span className="text-green-600">DLH Toba</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-3xl p-8 shadow-2xl">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl font-black">V</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Visi</h3>
              <p className="text-green-100 text-lg leading-relaxed">
                "Mengembangkan sumber daya alam Toba secara bertanggung jawab 
                untuk mewujudkan lingkungan yang lestari dan berkelanjutan."
              </p>
            </div>
            
            {/* Misi Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl font-black text-green-600">M</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Misi</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                "Membangun komunitas Toba yang sehat dan berdaya saing 
                melalui pengelolaan lingkungan yang partisipatif dan inovatif."
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <ChevronRight size={18} className="text-green-600" />
                  <span className="text-slate-600">Edukasi lingkungan berkelanjutan</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight size={18} className="text-green-600" />
                  <span className="text-slate-600">Pengelolaan sampah terpadu</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight size={18} className="text-green-600" />
                  <span className="text-slate-600">Pelibatan aktif masyarakat</span>
                </div>
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

      {/* HUBUNGAN SECTION */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hubungan</h2>
          <p className="text-green-100 text-lg mb-8">
            Layanan pelatihan ini dapat melibatkan seluruh anggota keluarga di seluruh Indonesia.
          </p>
          <Link 
            href="/Warga" 
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-xl"
          >
            Ikut Berpartisipasi
          </Link>
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
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
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