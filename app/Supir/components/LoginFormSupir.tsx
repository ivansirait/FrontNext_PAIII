"use client";
import { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, LogIn, Truck } from 'lucide-react';

export default function LoginFormSupir({ onLoginSuccess }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Pastikan yang login adalah OPERATOR (Supir)
      if (res.data.user.role !== 'OPERATOR') {
        alert("Akses ditolak. Ini adalah akun Admin, silakan gunakan portal Admin.");
        return;
      }

      onLoginSuccess(res.data.user);
    } catch (err: any) {
      alert(err.response?.data?.error || "Login Gagal. Cek koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col justify-center px-6">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="bg-[#2D5A27] w-20 h-20 rounded-[25px] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-100">
            <Truck size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 italic">CLEANCITY DRIVER</h1>
          <p className="text-slate-400 text-sm font-medium">Silakan masuk untuk melihat tugas Anda</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Supir"
              className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 transition-all font-medium text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Kata Sandi"
              className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 transition-all font-medium text-slate-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D5A27] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-green-100 hover:bg-[#1f3f1b] transition-all flex items-center justify-center gap-2"
          >
            {loading ? "MEMPROSES..." : <><LogIn size={20} /> MASUK SEKARANG</>}
          </button>
        </form>
        
        <p className="text-center mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
          Hubungi Admin jika lupa password
        </p>
      </div>
    </div>
  );
}