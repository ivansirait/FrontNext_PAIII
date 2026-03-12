"use client";
import { useState, useEffect, FormEvent, useMemo } from 'react';
import axios from 'axios';
import { 
  Plus, Edit3, Trash2, Search, Mail, Phone, 
  X, ShieldCheck, Loader2, Users, 
  CheckCircle2, XCircle, Eye, EyeOff,
  UserPlus, UserCog, Activity, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Supir {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function ManageSupir() {
  // State
  const [supirList, setSupirList] = useState<Supir[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupir, setEditingSupir] = useState<Supir | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    isActive: true
  });

  // Fetch data
  const fetchSupir = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/supir', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSupirList(res.data);
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupir();
  }, []);

  // Stats logic
  const stats = useMemo(() => ({
    total: supirList.length,
    active: supirList.filter(s => s.isActive).length,
    inactive: supirList.filter(s => !s.isActive).length,
  }), [supirList]);

  // Filter logic
  const filteredSupir = useMemo(() => 
    supirList.filter(s => 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [supirList, searchTerm]
  );

  // Handlers
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingSupir) {
        await axios.put(`http://localhost:5000/api/admin/supir/${editingSupir.id}`, formData, config);
        toast.success('Data diperbarui');
      } else {
        await axios.post('http://localhost:5000/api/admin/supir', formData, config);
        toast.success('Personil ditambahkan');
      }
      setShowModal(false);
      fetchSupir();
    } catch (error) {
      toast.error('Gagal memproses data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus personil ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/supir/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Personil dihapus');
      fetchSupir();
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  const toggleStatus = async (supir: Supir) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/supir/${supir.id}`,
        { ...supir, isActive: !supir.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status diperbarui`);
      fetchSupir();
    } catch {
      toast.error('Gagal mengubah status');
    }
  };

  const openModal = (supir?: Supir) => {
    if (supir) {
      setEditingSupir(supir);
      setFormData({
        fullName: supir.fullName, email: supir.email, password: '',
        phoneNumber: supir.phoneNumber || '', isActive: supir.isActive
      });
    } else {
      setEditingSupir(null);
      setFormData({ fullName: '', email: '', password: '', phoneNumber: '', isActive: true });
    }
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: { background: '#064E3B', color: '#fff', borderRadius: '12px' },
          success: { icon: '✅' },
          error: { background: '#991B1B' }
        }}
      />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header - Dominan #064E3B */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-emerald-100/50 p-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/5 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#064E3B] p-3 rounded-xl shadow-lg shadow-emerald-900/20">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#064E3B]">
                  Manajemen Kru Armada
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-slate-500 font-medium">{stats.active} Aktif</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-xs text-slate-500 font-medium">Total {stats.total} Kru</span>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal()}
              className="flex items-center justify-center gap-2 bg-[#064E3B] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-900/20 hover:bg-[#053f30] transition-all group"
            >
              <UserPlus size={18} />
              Tambah Personil
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Personil', value: stats.total, icon: Users, color: 'bg-[#064E3B]' },
            { label: 'Aktif Operasi', value: stats.active, icon: Activity, color: 'bg-emerald-600' },
            { label: 'Nonaktif', value: stats.inactive, icon: XCircle, color: 'bg-red-600' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl shadow-inner text-white`}>
                <stat.icon size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black-400" size={18} />
              <input
                type="text"
                placeholder="Cari kru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Kru</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Kontak</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400">Memuat data...</td></tr>
                ) : filteredSupir.map((supir) => (
                  <tr key={supir.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
                          {supir.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{supir.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{supir.id.slice(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5"><Mail size={12} className="text-emerald-600"/> {supir.email}</span>
                        <span className="flex items-center gap-1.5"><Phone size={12} className="text-emerald-600"/> {supir.phoneNumber || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(supir)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all ${
                          supir.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-red-500 text-white-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {supir.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(supir)} className="p-2 text-slate-400 hover:text-[#064E3B] transition-colors"><Edit3 size={16}/></button>
                        <button onClick={() => handleDelete(supir.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modal - Dominan #064E3B */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#064E3B]/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-emerald-100 overflow-hidden"
            >
              <div className="bg-[#064E3B] px-6 py-5 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2">
                  {editingSupir ? <UserCog size={20}/> : <UserPlus size={20}/>}
                  {editingSupir ? 'Edit Kru' : 'Kru Baru'}
                </h3>
                <button onClick={() => setShowModal(false)}><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input 
                  required value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm border-2 border-transparent focus:border-emerald-600/20 focus:bg-white outline-none transition-all font-medium" 
                  placeholder="Nama Lengkap" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="email" required value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm border-2 border-transparent focus:border-emerald-600/20 focus:bg-white outline-none transition-all font-medium" 
                    placeholder="Email" 
                  />
                  <input 
                    type="text" value={formData.phoneNumber} 
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm border-2 border-transparent focus:border-emerald-600/20 focus:bg-white outline-none transition-all font-medium" 
                    placeholder="WhatsApp" 
                  />
                </div>
                {!editingSupir && (
                  <input 
                    type="password" required value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm border-2 border-transparent focus:border-emerald-600/20 focus:bg-white outline-none transition-all font-medium" 
                    placeholder="Password Akses" 
                  />
                )}
                <button
                  type="submit" disabled={submitting}
                  className="w-full py-4 bg-[#064E3B] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 hover:bg-[#053f30] transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18}/> : <ShieldCheck size={18}/>}
                  {editingSupir ? 'Simpan Perubahan' : 'Daftarkan Kru'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}