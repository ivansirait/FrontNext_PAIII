import { ClipboardList, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard({ laporanList }: { laporanList: any[] }) {
  const pending = laporanList.filter((l) => l.status === 'PENDING').length;
  const proses = laporanList.filter((l) => l.status === 'DITINDAKLANJUTI').length;
  const selesai = laporanList.filter((l) => l.status === 'SELESAI').length;

  return (
    <>
      <h1 className="text-3xl font-bold text-[#3D733D] mb-8">Selamat Datang, Admin!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="bg-orange-50 p-4 rounded-2xl mb-4"><ClipboardList className="text-orange-500" size={30}/></div>
          <span className="text-4xl font-black text-slate-800">{pending}</span>
          <span className="text-orange-500 font-bold uppercase text-xs tracking-wider mt-2">Menunggu</span>
        </div>
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="bg-blue-50 p-4 rounded-2xl mb-4"><Clock className="text-blue-500" size={30}/></div>
          <span className="text-4xl font-black text-slate-800">{proses}</span>
          <span className="text-blue-500 font-bold uppercase text-xs tracking-wider mt-2">Diproses</span>
        </div>
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="bg-green-50 p-4 rounded-2xl mb-4"><CheckCircle className="text-green-500" size={30}/></div>
          <span className="text-4xl font-black text-slate-800">{selesai}</span>
          <span className="text-green-500 font-bold uppercase text-xs tracking-wider mt-2">Selesai</span>
        </div>
      </div>
    </>
  );
}