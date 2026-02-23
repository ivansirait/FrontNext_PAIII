import { User } from 'lucide-react';

export default function LoginForm({ credentials, setCredentials, onLogin }: any) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-[#f1f5f1]">
      <form onSubmit={onLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-4 rounded-full mb-4"><User className="text-green-700" size={32} /></div>
          <h2 className="text-2xl font-extrabold text-green-800">Login Admin</h2>
        </div>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="p-4 rounded-2xl bg-slate-50 border outline-none focus:border-green-500" 
            onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-4 rounded-2xl bg-slate-50 border outline-none focus:border-green-500" 
            onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
          />
          <button type="submit" className="bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-green-700">Masuk Dashboard</button>
        </div>
      </form>
    </main>
  );
}