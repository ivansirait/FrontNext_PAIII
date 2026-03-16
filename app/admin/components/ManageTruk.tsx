"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Search, Truck, MapPin,
  Phone, User, X, ChevronDown, RefreshCw
} from 'lucide-react';

interface Truk {
  id: string;
  plateNumber: string;
  operatorId: string | null;
  operator?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
  } | null;
  status: 'AVAILABLE' | 'BUSY' | 'MAINTENANCE';
  lastLocation: string | null;
  lastPing: string | null;
  currentLat: string | null;
  currentLong: string | null;
  createdAt: string;
}

interface Supir {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
}

export default function ManageTruk() {
  const [trukList, setTrukList] = useState<Truk[]>([]);
  const [supirList, setSupirList] = useState<Supir[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTruk, setEditingTruk] = useState<Truk | null>(null);
  
  const [formData, setFormData] = useState({
    plateNumber: '',
    operatorId: '',
    status: 'AVAILABLE',
    lastLocation: ''
  });

  // Fetch data truk
  const fetchTruk = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/truks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrukList(res.data);
    } catch (error) {
      console.error('Error fetching truk:', error);
      alert('Gagal mengambil data truk');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data supir untuk dropdown
  const fetchSupir = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/supir', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter hanya supir yang aktif
      setSupirList(res.data.filter((s: any) => s.isActive));
    } catch (error) {
      console.error('Error fetching supir:', error);
    }
  };

  useEffect(() => {
    fetchTruk();
    fetchSupir();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openCreateModal = () => {
    setEditingTruk(null);
    setFormData({
      plateNumber: '',
      operatorId: '',
      status: 'AVAILABLE',
      lastLocation: ''
    });
    setShowModal(true);
  };

  const openEditModal = (truk: Truk) => {
    setEditingTruk(truk);
    setFormData({
      plateNumber: truk.plateNumber,
      operatorId: truk.operatorId || '',
      status: truk.status,
      lastLocation: truk.lastLocation || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingTruk) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/admin/truks/${editingTruk.id}`, 
          formData, 
          config
        );
        alert('Data truk berhasil diperbarui!');
      } else {
        // CREATE
        await axios.post(
          'http://localhost:5000/api/admin/truks', 
          formData, 
          config
        );
        alert('Truk baru berhasil ditambahkan!');
      }

      setShowModal(false);
      fetchTruk();
      
    } catch (error: any) {
      console.error('Error saving truk:', error);
      alert(error.response?.data?.error || 'Gagal menyimpan data truk');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus truk ini?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/truks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Truk berhasil dihapus!');
      fetchTruk();
    } catch (error) {
      console.error('Error deleting truk:', error);
      alert('Gagal menghapus truk');
    }
  };

  // Helper untuk status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'AVAILABLE':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Tersedia' };
      case 'BUSY':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Sedang Bertugas' };
      case 'MAINTENANCE':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Servis/Perbaikan' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }
  };

  const filteredTruk = trukList.filter(truk => 
    truk.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (truk.operator?.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (truk.lastLocation?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Data Truk</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data armada truk pengangkutan sampah
            </p>
          </div>
          
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Tambah Truk Baru</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari truk berdasarkan nomor polisi, supir, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : filteredTruk.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'Tidak ada truk yang cocok dengan pencarian' : 'Belum ada data truk'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Polisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Terakhir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terakhir Update</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTruk.map((truk, index) => {
                  const status = getStatusBadge(truk.status);
                  return (
                    <tr key={truk.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Truck size={16} className="text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{truk.plateNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {truk.operator ? (
                          <div className="flex items-center">
                            <User size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{truk.operator.fullName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {truk.lastLocation ? (
                          <div className="flex items-center">
                            <MapPin size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{truk.lastLocation}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {truk.lastPing ? new Date(truk.lastPing).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(truk)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(truk.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTruk ? 'Edit Data Truk' : 'Tambah Truk Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nomor Polisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Polisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="BK 1234 ABC"
                />
              </div>

              {/* Pilih Supir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supir
                </label>
                <select
                  name="operatorId"
                  value={formData.operatorId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih Supir (Opsional)</option>
                  {supirList.map(supir => (
                    <option key={supir.id} value={supir.id}>
                      {supir.fullName} {supir.phoneNumber ? `- ${supir.phoneNumber}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="AVAILABLE">Tersedia</option>
                  <option value="BUSY">Sedang Bertugas</option>
                  <option value="MAINTENANCE">Servis/Perbaikan</option>
                </select>
              </div>

              {/* Lokasi Terakhir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Terakhir
                </label>
                <input
                  type="text"
                  name="lastLocation"
                  value={formData.lastLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Pool Balige / Jl. Sisingamangaraja"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  {editingTruk ? 'Update Data' : 'Simpan Truk'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}