"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Search, Calendar, 
  User, Truck, MapPin, Filter, X, Eye
} from 'lucide-react';
import PenugasanDetail from './PenugasanDetail'; // Import komponen detail

interface Penugasan {
  id: string;
  taskNumber: string;
  type: string;
  status: string;
  location: string;
  district: string;
  scheduledAt: string;
  driver: {
    id: string;
    fullName: string;
    phoneNumber?: string;
  };
  truck?: {
    id: string;
    plateNumber: string;
  };
  report?: {
    id: string;
    description: string;
  };
}

export default function ManagePenugasan() {
  const [penugasanList, setPenugasanList] = useState<Penugasan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'aduan' | 'rutin'>('aduan');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState<Penugasan | null>(null);
  const [editingPenugasan, setEditingPenugasan] = useState<Penugasan | null>(null);
  
  const [supirList, setSupirList] = useState([]);
  const [trukList, setTrukList] = useState([]);
  const [laporanList, setLaporanList] = useState([]);
  
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: ''
  });

  const [formData, setFormData] = useState({
    reportId: '',
    driverId: '',
    truckId: '',
    scheduledAt: '',
    location: '',
    latitude: '',
    longitude: '',
    district: '',
    description: '',
    notes: ''
  });

  // Fetch data
  const fetchPenugasan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = 'http://localhost:5000/api/penugasan?';
      if (filter.status) url += `status=${filter.status}&`;
      if (filter.type) url += `type=${filter.type}&`;
      if (filter.startDate) url += `startDate=${filter.startDate}&`;
      if (filter.endDate) url += `endDate=${filter.endDate}&`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPenugasanList(res.data.data);
    } catch (error) {
      console.error('Error fetching penugasan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch supir
      const supirRes = await axios.get('http://localhost:5000/api/penugasan/supir', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSupirList(supirRes.data.data);

      // Fetch truk
      const trukRes = await axios.get('http://localhost:5000/api/penugasan/truk', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrukList(trukRes.data.data);

      // Fetch laporan pending
      const laporanRes = await axios.get('http://localhost:5000/api/laporan?status=PENDING', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLaporanList(laporanRes.data);
    } catch (error) {
      console.error('Error fetching dropdown:', error);
    }
  };

  useEffect(() => {
    fetchPenugasan();
    fetchDropdownData();
  }, []);

  // Filter pencarian
  const filteredPenugasan = penugasanList.filter(item => 
    item.taskNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.driver?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle pilih laporan
  const handleSelectLaporan = (laporan: any) => {
    setFormData({
      ...formData,
      reportId: laporan.id,
      location: laporan.description || '',
      latitude: laporan.latitude,
      longitude: laporan.longitude,
      district: laporan.district || '',
      description: laporan.description
    });
  };

  // Handle submit create
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const endpoint = modalType === 'aduan' 
        ? 'http://localhost:5000/api/penugasan/aduan'
        : 'http://localhost:5000/api/penugasan/rutin';

      await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Penugasan berhasil dibuat!');
      setShowModal(false);
      fetchPenugasan();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal membuat penugasan');
    }
  };

  // 🔴 FUNGSI EDIT - Buka modal edit
  const handleEdit = (penugasan: Penugasan) => {
    setEditingPenugasan(penugasan);
    setFormData({
      reportId: penugasan.report?.id || '',
      driverId: penugasan.driver.id,
      truckId: penugasan.truck?.id || '',
      scheduledAt: penugasan.scheduledAt.slice(0, 16), // Format untuk datetime-local
      location: penugasan.location,
      latitude: '', // Isi dari data yang ada
      longitude: '',
      district: penugasan.district,
      description: penugasan.description || '',
      notes: ''
    });
    setModalType(penugasan.type === 'ADUAN' ? 'aduan' : 'rutin');
    setShowModal(true);
  };

  // 🔴 FUNGSI UPDATE - Submit edit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPenugasan) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/penugasan/${editingPenugasan.id}`, 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Penugasan berhasil diperbarui!');
      setShowModal(false);
      setEditingPenugasan(null);
      fetchPenugasan();
      resetForm();
    } catch (error) {
      console.error('Error updating:', error);
      alert('Gagal memperbarui penugasan');
    }
  };

  // 🔴 FUNGSI DELETE - Hapus penugasan
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus penugasan ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/penugasan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Penugasan berhasil dihapus!');
      fetchPenugasan();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus penugasan');
    }
  };

  // 🔴 FUNGSI DETAIL - Lihat detail
  const handleViewDetail = (penugasan: Penugasan) => {
    setSelectedPenugasan(penugasan);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      reportId: '', driverId: '', truckId: '', scheduledAt: '',
      location: '', latitude: '', longitude: '', district: '',
      description: '', notes: ''
    });
    setEditingPenugasan(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Penugasan</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola penugasan supir untuk pengangkutan sampah
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => { 
                setModalType('aduan'); 
                setEditingPenugasan(null);
                resetForm();
                setShowModal(true); 
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Tugas Aduan</span>
            </button>
            <button
              onClick={() => { 
                setModalType('rutin'); 
                setEditingPenugasan(null);
                resetForm();
                setShowModal(true); 
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Tugas Rutin</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nomor tugas, lokasi, atau supir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter.status}
            onChange={(e) => {
              setFilter({...filter, status: e.target.value});
              fetchPenugasan();
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="DITUGASKAN">Ditugaskan</option>
            <option value="DITERIMA">Diterima</option>
            <option value="DALAM_PERJALANAN">Dalam Perjalanan</option>
            <option value="TIBA">Tiba</option>
            <option value="BEKERJA">Bekerja</option>
            <option value="SELESAI">Selesai</option>
          </select>
          <select
            value={filter.type}
            onChange={(e) => {
              setFilter({...filter, type: e.target.value});
              fetchPenugasan();
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Semua Tipe</option>
            <option value="ADUAN">Aduan</option>
            <option value="RUTIN">Rutin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : filteredPenugasan.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Tidak ada data penugasan
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Tugas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPenugasan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {item.taskNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.type === 'ADUAN' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.location}</div>
                      <div className="text-xs text-gray-500">{item.district}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={14} className="text-gray-400 mr-2" />
                        <span className="text-sm">{item.driver?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(item.scheduledAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'SELESAI' ? 'bg-green-100 text-green-800' :
                        item.status === 'DITUGASKAN' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'DITERIMA' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'DALAM_PERJALANAN' ? 'bg-purple-100 text-purple-800' :
                        item.status === 'TIBA' ? 'bg-indigo-100 text-indigo-800' :
                        item.status === 'BEKERJA' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {/* 🔴 TOMBOL DETAIL - SEKARANG BERFUNGSI */}
                        <button 
                          onClick={() => handleViewDetail(item)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {/* 🔴 TOMBOL EDIT - SEKARANG BERFUNGSI */}
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg hover:bg-green-100 transition-colors"
                          title="Edit Penugasan"
                        >
                          <Edit size={16} />
                        </button>
                        
                        {/* 🔴 TOMBOL HAPUS - SEKARANG BERFUNGSI */}
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus Penugasan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPenugasan ? 'Edit Penugasan' : (modalType === 'aduan' ? 'Buat Tugas dari Aduan' : 'Buat Tugas Rutin')}
              </h3>
              <button onClick={() => {
                setShowModal(false);
                setEditingPenugasan(null);
                resetForm();
              }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingPenugasan ? handleUpdate : handleSubmit} className="p-6 space-y-4">
              {modalType === 'aduan' && !editingPenugasan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Laporan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reportId"
                    value={formData.reportId}
                    onChange={(e) => {
                      const selected = laporanList.find((l: any) => l.id === e.target.value);
                      if (selected) handleSelectLaporan(selected);
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">-- Pilih Laporan --</option>
                    {laporanList.map((l: any) => (
                      <option key={l.id} value={l.id}>
                        {l.description?.substring(0, 50)}... ({l.district})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(modalType === 'rutin' || editingPenugasan) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Alamat lengkap"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="-6.123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="106.123456"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Supir <span className="text-red-500">*</span>
                </label>
                <select
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">-- Pilih Supir --</option>
                  {supirList.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Truk (Opsional)
                </label>
                <select
                  name="truckId"
                  value={formData.truckId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">-- Tanpa Truk --</option>
                  {trukList.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.plateNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jadwal <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Catatan tambahan untuk supir..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  {editingPenugasan ? 'Update Penugasan' : 'Buat Penugasan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPenugasan(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {showDetailModal && selectedPenugasan && (
        <PenugasanDetail
          penugasan={selectedPenugasan}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPenugasan(null);
          }}
        />
      )}
    </div>
  );
}