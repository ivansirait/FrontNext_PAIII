"use client";
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Search, Truck, MapPin,
  User, X, Loader2, Activity, ShieldCheck, 
  Settings2, Navigation2, Clock, AlertTriangle,
  Filter, ChevronDown, MoreVertical, Wrench,
  CircleCheck, CircleAlert, Circle, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Truk {
  id: string;
  plateNumber: string;
  operatorId: string | null;
  status: 'AVAILABLE' | 'BUSY' | 'MAINTENANCE';
  lastLocation: string | null;
  operator?: {
    id: string;
    fullName: string;
    phone?: string;
  };
  createdAt?: string;
}

interface Supir {
  id: string;
  fullName: string;
  phone?: string;
  isActive: boolean;
}

export default function ManageTruk() {
  const [trukList, setTrukList] = useState<Truk[]>([]);
  const [supirList, setSupirList] = useState<Supir[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTruk, setEditingTruk] = useState<Truk | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    plateNumber: '', 
    operatorId: '', 
    status: 'AVAILABLE' as 'AVAILABLE' | 'BUSY' | 'MAINTENANCE', 
    lastLocation: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [resTruk, resSupir] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/truks', config),
        axios.get('http://localhost:5000/api/admin/supir', config)
      ]);
      setTrukList(resTruk.data);
      setSupirList(resSupir.data.filter((s: Supir) => s.isActive));
    } catch (error) { 
      toast.error('Gagal sinkronisasi'); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTruk = useMemo(() => {
    return trukList
      .filter(t => 
        (t.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.operator?.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(t => statusFilter === 'ALL' ? true : t.status === statusFilter);
  }, [trukList, searchTerm, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { ...formData, operatorId: formData.operatorId || null };
      if (editingTruk) {
        await axios.put(`http://localhost:5000/api/admin/truks/${editingTruk.id}`, payload, config);
      } else {
        await axios.post('http://localhost:5000/api/admin/truks', payload, config);
      }
      toast.success(editingTruk ? 'Data truk berhasil diperbarui' : 'Truk baru berhasil ditambahkan');
      setShowModal(false); 
      fetchData();
    } catch { 
      toast.error('Gagal menyimpan data'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleDelete = async (id: string, plateNumber: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus truk ${plateNumber}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/truks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Truk berhasil dihapus');
        fetchData();
      } catch {
        toast.error('Gagal menghapus truk');
      }
    }
  };

  const openModal = (truk?: Truk) => {
    if (truk) {
      setEditingTruk(truk);
      setFormData({ 
        plateNumber: truk.plateNumber, 
        operatorId: truk.operatorId || '', 
        status: truk.status, 
        lastLocation: truk.lastLocation || '' 
      });
    } else {
      setEditingTruk(null);
      setFormData({ plateNumber: '', operatorId: '', status: 'AVAILABLE', lastLocation: '' });
    }
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'AVAILABLE':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: <CircleCheck size={12} className="text-emerald-500" />,
          label: 'Tersedia'
        };
      case 'BUSY':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: <Activity size={12} className="text-amber-500" />,
          label: 'Sedang Bertugas'
        };
      case 'MAINTENANCE':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          icon: <Wrench size={12} className="text-rose-500" />,
          label: 'Perbaikan'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          icon: <Circle size={12} className="text-slate-400" />,
          label: status
        };
    }
  };

  const stats = {
    total: trukList.length,
    available: trukList.filter(t => t.status === 'AVAILABLE').length,
    busy: trukList.filter(t => t.status === 'BUSY').length,
    maintenance: trukList.filter(t => t.status === 'MAINTENANCE').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 font-sans">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'white',
          color: '#1e293b',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
        },
      }} />

      {/* Header dengan Stats */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg shadow-emerald-200/50">
              <Truck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Manajemen Armada</h1>
              <p className="text-sm text-slate-500">Kelola data truk dan operator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Filter size={16} />
              Filter
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-200/50"
            >
              <Plus size={18} strokeWidth={2.5} />
              Tambah Truk
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Truck size={18} className="text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Armada</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CircleCheck size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Tersedia</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Activity size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Bertugas</p>
                <p className="text-2xl font-bold text-amber-600">{stats.busy}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-2 rounded-lg">
                <Wrench size={18} className="text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Perbaikan</p>
                <p className="text-2xl font-bold text-rose-600">{stats.maintenance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

   {/* Search & Filter Bar */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
  <div className="flex flex-col gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Cari berdasarkan plat nomor atau nama driver..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
      />
    </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === 'ALL' 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua Status
                  </button>
                  <button
                    onClick={() => setStatusFilter('AVAILABLE')}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      statusFilter === 'AVAILABLE' 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <CircleCheck size={12} /> Tersedia
                  </button>
                  <button
                    onClick={() => setStatusFilter('BUSY')}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      statusFilter === 'BUSY' 
                        ? 'bg-amber-600 text-white shadow-md' 
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    <Activity size={12} /> Bertugas
                  </button>
                  <button
                    onClick={() => setStatusFilter('MAINTENANCE')}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      statusFilter === 'MAINTENANCE' 
                        ? 'bg-rose-600 text-white shadow-md' 
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    <Wrench size={12} /> Perbaikan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Truk List - Grid View untuk Mobile, Table untuk Desktop */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={32} />
            <p className="text-sm text-slate-500">Memuat data armada...</p>
          </div>
        ) : filteredTruk.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Truck size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">Tidak ada data truk</p>
          </div>
        ) : (
          filteredTruk.map((truk) => {
            const status = getStatusBadge(truk.status);
            return (
              <motion.div
                key={truk.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                      <Truck size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-800">{truk.plateNumber}</h3>
                      <p className="text-xs text-slate-400">ID: {truk.id.slice(0,8)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(truk)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(truk.id, truk.plateNumber)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[10px] text-slate-400 mb-1">DRIVER</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center text-xs font-bold text-slate-600">
                        {truk.operator?.fullName?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {truk.operator?.fullName || 'Tidak ada driver'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[10px] text-slate-400 mb-1">STATUS</p>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${status.bg} ${status.text} ${status.border} border`}>
                      {status.icon}
                      <span className="text-xs font-medium">{status.label}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-600 truncate">
                    {truk.lastLocation || 'Lokasi tidak tersedia'}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Lokasi Terakhir</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={32} />
                    <p className="text-sm text-slate-500">Memuat data armada...</p>
                  </td>
                </tr>
              ) : filteredTruk.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Truck size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">Tidak ada data truk</p>
                  </td>
                </tr>
              ) : (
                filteredTruk.map((truk) => {
                  const status = getStatusBadge(truk.status);
                  return (
                    <motion.tr
                      key={truk.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <Truck size={16} className="text-slate-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-800">{truk.plateNumber}</div>
                            <div className="text-xs text-slate-400">ID: {truk.id.slice(0,8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-slate-100 rounded-md flex items-center justify-center text-xs font-bold text-slate-600">
                            {truk.operator?.fullName?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm text-slate-600">
                            {truk.operator?.fullName || <span className="text-slate-400 italic">Tidak ada driver</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.text} ${status.border} border`}>
                          {status.icon}
                          <span className="text-xs font-medium">{status.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          <span className="truncate max-w-[200px]">{truk.lastLocation || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(truk)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(truk.id, truk.plateNumber)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <Truck size={18} className="text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold">
                    {editingTruk ? 'Edit Data Truk' : 'Tambah Truk Baru'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    PLAT NOMOR <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({...formData, plateNumber: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Contoh: B 1234 XYZ"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      DRIVER
                    </label>
                    <select
                      value={formData.operatorId}
                      onChange={(e) => setFormData({...formData, operatorId: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="">Pilih Driver</option>
                      {supirList.map(s => (
                        <option key={s.id} value={s.id}>{s.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      STATUS
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="AVAILABLE">Tersedia</option>
                      <option value="BUSY">Sedang Bertugas</option>
                      <option value="MAINTENANCE">Perbaikan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    LOKASI
                  </label>
                  <input
                    value={formData.lastLocation}
                    onChange={(e) => setFormData({...formData, lastLocation: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Contoh: Pool Jakarta"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Data'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}