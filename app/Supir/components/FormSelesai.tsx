"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { Camera, CheckCircle } from "lucide-react";

export default function FormSelesai({ report, onSuccess, onCancel }: any) {
  const [volume, setVolume] = useState("0");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submitSelesai = async () => {
    if (!volume || Number(volume) <= 0) {
      return alert("Volume wajib diisi");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("volumeKg", volume);
    if (photo) formData.append("photoAfter", photo);

    try {
      await axios.post(
        `http://localhost:5000/laporan/${report.id}/selesai`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Data berhasil dikirim");
      onSuccess();
    } catch {
      alert("❌ Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[30px] shadow-xl border border-slate-200">
      <h2 className="font-black text-lg mb-4">
        Masukkan Volume Sampah (KG)
      </h2>

      <input
        type="number"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(e.target.value)}
        className="w-full text-5xl font-black text-center border rounded-2xl p-4 mb-6"
      />

      <div className="mb-6">
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 py-4 rounded-2xl font-bold"
        >
          <Camera size={18} /> Ambil Foto Bukti
        </button>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          ref={fileRef}
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onCancel}
          className="py-4 rounded-2xl bg-slate-200 font-bold"
        >
          Batal
        </button>
        <button
          onClick={submitSelesai}
          disabled={loading}
          className="py-4 rounded-2xl bg-green-600 text-white font-bold flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} /> SELESAI
        </button>
      </div>
    </div>
  );
}