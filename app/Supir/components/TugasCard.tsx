import { Navigation, CheckCircle, ImageIcon, MapPin } from 'lucide-react';

export default function TugasCard({ item, onSelesai }: any) {
  const bukaPeta = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="bg-white p-5 rounded-[25px] shadow-sm border border-slate-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-md uppercase tracking-tighter">
          TUGAS AKTIF
        </span>
        <p className="text-xs text-slate-400 font-mono">#{item.id.toString().slice(-5)}</p>
      </div>

      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1">
        <MapPin size={16} className="text-red-500" /> {item.lokasi}
      </h3>

      <div className="flex gap-4">
        <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200">
          {item.photoUrl ? (
            <img src={item.photoUrl} className="w-full h-full object-cover" alt="Foto Lokasi" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
          )}
        </div>
        <div className="flex-1 text-sm text-slate-600 italic">
          "{item.description}"
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <button 
          onClick={() => bukaPeta(Number(item.latitude), Number(item.longitude))}
          className="flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition-all"
        >
          <Navigation size={18}/> MAPS
        </button>
        <button 
          onClick={() => onSelesai(item.id)}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100"
        >
          <CheckCircle size={18}/> SELESAI
        </button>
      </div>
    </div>
  );
}