"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Search, MapPin, 
  Users, Home, Map, X, RefreshCw, ToggleLeft, ToggleRight
} from 'lucide-react';

interface Wilayah {
  id: string;
  name: string;
  code: string | null;
  isActive: boolean;
  population: number | null;
  address: string | null;
  capacityVolume: number | null;
  latitude: string;
  longitude: string;
  center: number[];
  createdAt: string;
}

export default function ManageWilayah() {
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWilayah, setEditingWilayah] = useState<Wilayah | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    population: '',
    address: '',
    capacityVolume: '',
    latitude: '',
    longitude: '',
    isActive: true
  });

  // Fetch data wilayah
  const fetchWilayah = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/wilayah', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWilayahList(res.data);
    } catch (error) {
      console.error('Error fetching wilayah:', error);
      alert('Gagal mengambil data wilayah');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayah();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openCreateModal = () => {
    setEditingWilayah(null);
    setFormData({
      name: '',
      code: '',
      population: '',
      address: '',
      capacityVolume: '',
      latitude: '',
      longitude: '',
      isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = (wilayah: Wilayah) => {
    setEditingWilayah(wilayah);
    setFormData({
      name: wilayah.name,
      code: wilayah.code || '',
      population: wilayah.population?.toString() || '',
      address: wilayah.address || '',
      capacityVolume: wilayah.capacityVolume?.toString() || '',
      latitude: wilayah.latitude,
      longitude: wilayah.longitude,
      isActive: wilayah.isActive
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

      const dataToSend = {
        ...formData,
        population: formData.population ? parseInt(formData.population) : null,
        capacityVolume: formData.capacityVolume ? parseInt(formData.capacityVolume) : null,
      };

      if (editingWilayah) {
        await axios.put(
          `http://localhost:5000/api/admin/wilayah/${editingWilayah.id}`, 
          dataToSend, 
          config
        );
        alert('Data wilayah berhasil diperbarui!');
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/wilayah', 
          dataToSend, 
          config
        );
        alert('Wilayah baru berhasil ditambahkan!');
      }

      setShowModal(false);
      fetchWilayah();
      
    } catch (error: any) {
      console.error('Error saving wilayah:', error);
      alert(error.response?.data?.error || 'Gagal menyimpan data wilayah');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus wilayah ini?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/wilayah/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Wilayah berhasil dihapus!');
      fetchWilayah();
    } catch (error) {
      console.error('Error deleting wilayah:', error);
      alert('Gagal menghapus wilayah');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/admin/wilayah/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWilayah();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Gagal mengubah status wilayah');
    }
  };

  const filteredWilayah = wilayahList.filter(wilayah => 
    wilayah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (wilayah.code?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (wilayah.address?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Data Wilayah</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data 9 kecamatan di Kabupaten Toba
            </p>
          </div>
          
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Tambah Wilayah</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari wilayah berdasarkan nama, kode, atau alamat..."
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
        ) : filteredWilayah.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'Tidak ada wilayah yang cocok dengan pencarian' : 'Belum ada data wilayah'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kecamatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penduduk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Koordinat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWilayah.map((wilayah, index) => (
                  <tr key={wilayah.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{wilayah.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {wilayah.code || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {wilayah.population ? wilayah.population.toLocaleString() + ' jiwa' : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {wilayah.latitude}, {wilayah.longitude}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(wilayah.id, wilayah.isActive)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                          wilayah.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {wilayah.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {wilayah.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(wilayah)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(wilayah.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100"
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

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingWilayah ? 'Edit Data Wilayah' : 'Tambah Wilayah Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Kecamatan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Balige"
                  />
                </div>

                {/* Kode Wilayah */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kode Wilayah</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="BLG"
                  />
                </div>

                {/* Jumlah Penduduk */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Penduduk</label>
                  <input
                    type="number"
                    name="population"
                    value={formData.population}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="45000"
                  />
                </div>

                {/* Kapasitas TPS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas TPS (m³)</label>
                  <input
                    type="number"
                    name="capacityVolume"
                    value={formData.capacityVolume}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                {/* Status Aktif */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>

                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="2.3333"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="99.0667"
                  />
                </div>

                {/* Alamat */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Kantor Kecamatan</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Jl. Sisingamangaraja No. 1, Balige"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  {editingWilayah ? 'Update Data' : 'Simpan Wilayah'}
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