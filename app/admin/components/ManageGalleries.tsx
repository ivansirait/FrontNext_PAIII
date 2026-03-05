"use client";
import { useState, useRef } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Search, Star, Upload, X } from 'lucide-react';

interface ManageGalleriesProps {
  galleries: any[];
  onGalleriesUpdate: () => void;
}

export default function ManageGalleries({ galleries, onGalleriesUpdate }: ManageGalleriesProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isSlider: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  // FUNGSI UPLOAD FILE KE SUPABASE (sama seperti di laporan)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file (hanya gambar)
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }

    // Set preview
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Upload ke server
    setUploading(true);

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      
      // Upload ke endpoint upload (yang sudah diupdate)
      const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      // Set URL gambar dari response (URL Supabase)
      setFormData(prev => ({
        ...prev,
        imageUrl: res.data.imageUrl
      }));

      alert('Gambar berhasil diupload ke Supabase!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const openModal = (gallery: any = null) => {
    if (gallery) {
      setEditingGallery(gallery);
      setFormData({
        title: gallery.title || '',
        description: gallery.description || '',
        imageUrl: gallery.imageUrl || '',
        isSlider: gallery.isSlider || false
      });
      if (gallery.imageUrl) {
        setPreviewUrl(gallery.imageUrl);
      }
    } else {
      setEditingGallery(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        isSlider: false
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      alert('Gambar harus diupload terlebih dahulu!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const dataToSend = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        isSlider: formData.isSlider
      };

      if (editingGallery) {
        await axios.put(`http://localhost:5000/api/galleries/${editingGallery.id}`, dataToSend, config);
        alert('Galeri berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/galleries', dataToSend, config);
        alert('Galeri berhasil ditambahkan!');
      }
      
      setShowModal(false);
      onGalleriesUpdate();
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('Gagal menyimpan galeri');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/galleries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Galeri berhasil dihapus!');
      onGalleriesUpdate();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Gagal menghapus galeri');
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredGalleries = galleries.filter(gallery => 
    gallery.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gallery.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Galeri Homepage</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari gambar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          {/* Add Button */}
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span>Tambah Gambar</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredGalleries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Belum ada gambar. Silakan tambah gambar baru.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery: any) => (
            <div key={gallery.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                  src={gallery.imageUrl} 
                  alt={gallery.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
                  }}
                />
                {gallery.isSlider && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star size={12} />
                    <span>Slider</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {gallery.title || 'Tanpa Judul'}
                </h3>
                {gallery.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {gallery.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(gallery.createdAt).toLocaleDateString('id-ID')}
                </p>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(gallery)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingGallery ? 'Edit Gambar' : 'Tambah Gambar Baru'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Judul Gambar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Gambar
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan judul gambar"
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan deskripsi gambar..."
                  />
                </div>

                {/* Upload File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Gambar <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                          <span>Mengupload...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          <span>Pilih Gambar</span>
                        </>
                      )}
                    </button>
                    
                    {formData.imageUrl && !uploading && (
                      <span className="text-sm text-green-600">
                        ✓ Gambar terupload ke Supabase
                      </span>
                    )}
                  </div>

                  {/* Preview Gambar */}
                  {previewUrl && (
                    <div className="mt-4 relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="h-40 w-auto rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Slider Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSlider"
                    id="isSlider"
                    checked={formData.isSlider}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isSlider" className="ml-2 block text-sm text-gray-700">
                    Tampilkan di Slider Homepage
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    removeImage();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formData.imageUrl || uploading}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50"
                >
                  {editingGallery ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}