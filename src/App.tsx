import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  FileCheck, 
  PieChart, 
  LogOut, 
  ClipboardList, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Printer,
  Users,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit,
  Download,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getMockData, callGasAction } from './services/gasService';
import { verifyDesignPortfolio } from './services/aiService';

// --- Types ---
type Role = 'ASESI' | 'ADMIN' | 'DIREKTUR' | null;

interface User {
  userId: string;
  username: string;
  role: Role;
  nama: string;
  nisn?: string;
}

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastRegId, setLastRegId] = useState<string | null>(null);

  // Auto logout handling could go here
  
  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen bg-bg-main font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="w-60 bg-sidebar text-text-main flex flex-col h-full z-50 border-r border-border-subtle"
          >
            <div className="p-6 border-b border-border-subtle bg-white">
              <h1 className="text-sm font-bold tracking-tight text-text-main flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1INrEt4FMNAuKzkDe2lZaQVcYFOc8f9YN" 
                    alt="Logo LSP" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="leading-none">
                  <p className="font-bold">LSP SMK TP1</p>
                  <p className="text-[10px] text-text-muted font-medium mt-0.5">Sertifikasi Manajemen</p>
                </div>
              </h1>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar shadow-inner shadow-black/5">
              <NavItem 
                active={view === 'dashboard'} 
                onClick={() => setView('dashboard')}
                icon={<LayoutDashboard size={18} />}
                label="Ringkasan Utama"
              />
              
              {(user?.role?.toUpperCase() === 'ASESI') && (
                <>
                  <div className="pt-6 pb-2 px-4 shadow-sm mb-2 bg-bg-main/50 rounded-lg mx-2">
                    <p className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">Menu Siswa</p>
                  </div>
                  <NavItem 
                    active={view === 'apl01'} 
                    onClick={() => setView('apl01')}
                    icon={<UserCircle size={18} />}
                    label="Pendaftaran (APL-01)"
                  />
                  <NavItem 
                    active={view === 'apl02'} 
                    onClick={() => setView('apl02')}
                    icon={<ClipboardList size={18} />}
                    label="Asesmen (APL-02)"
                  />
                </>
              )}

              {user?.role?.toUpperCase() === 'ADMIN' && (
                <>
                  <div className="pt-6 pb-2 px-4 shadow-sm mb-2 bg-emerald-50 rounded-lg mx-2 mt-4">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Verifikasi</p>
                  </div>
                  <NavItem 
                    active={view === 'verification'} 
                    onClick={() => setView('verification')}
                    icon={<FileCheck size={18} />}
                    label="Antrean Sertifikasi"
                  />
                </>
              )}

              {(user?.role?.toUpperCase() === 'DIREKTUR' || user?.role?.toUpperCase() === 'ADMIN') && (
                <>
                  <div className="pt-6 pb-2 px-4 shadow-sm mb-2 bg-blue-50 rounded-lg mx-2 mt-4">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Sistem Laporan</p>
                  </div>
                  <NavItem 
                    active={view === 'recap'} 
                    onClick={() => setView('recap')}
                    icon={<PieChart size={18} />}
                    label="Rekapitulasi LSP"
                  />
                </>
              )}

              {user?.role?.toUpperCase() === 'ADMIN' && (
                <>
                  <div className="pt-6 pb-2 px-4 shadow-sm mb-2 bg-slate-100 rounded-lg mx-2 mt-4">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Administrator</p>
                  </div>
                  <NavItem 
                    active={view === 'master-siswa'} 
                    onClick={() => setView('master-siswa')}
                    icon={<Users size={18} />}
                    label="Data Master Siswa"
                  />
                  <NavItem 
                    active={view === 'master-skema'} 
                    onClick={() => setView('master-skema')}
                    icon={<Database size={18} />}
                    label="Data Unit Kompetensi"
                  />
                  <NavItem 
                    active={view === 'master-users'} 
                    onClick={() => setView('master-users')}
                    icon={<Settings size={18} />}
                    label="Kelola Pengguna"
                  />
                </>
              )}
            </nav>

            <div className="p-4 border-t border-border-subtle">
              <div className="flex items-center gap-3 px-2 py-3 bg-bg-main rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-bold text-xs text-accent">
                  {user?.nama?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold truncate">{user?.nama || 'Unknown User'}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">{user?.role || 'Guest'}</p>
                </div>
                <button 
                  onClick={() => setUser(null)}
                  className="p-1.5 hover:bg-red-50 rounded-md transition-colors group"
                >
                  <LogOut size={16} className="text-text-muted group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative bg-bg-main">
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-6 left-6 z-[60] p-3 bg-white rounded-2xl shadow-xl shadow-black/5 border border-border-subtle text-accent active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="p-10 max-w-6xl mx-auto">
          {view === 'dashboard' && <DashboardView user={user} setView={setView} />}
          {view === 'apl01' && (
            <AsesiAPL01 
              user={user} 
              onComplete={(id: string) => { 
                setLastRegId(id); 
                setView('apl02'); 
              }} 
            />
          )}
          {view === 'apl02' && (
            <AsesiAPL02 
              user={user} 
              idReg={lastRegId} 
              onComplete={() => setView('dashboard')} 
            />
          )}
          {view === 'master-siswa' && (
            <MasterDataView 
              title="Data Master Siswa" 
              sheetName="DATA SISWA" 
              idColumn="NIK"
              columns={[
                { key: 'NAMA LENGKAP', label: 'Nama Lengkap' },
                { key: 'NIK', label: 'NIK' },
                { key: 'TEMPAT LAHIR', label: 'Tempat Lahir' },
                { key: 'TANGGAL LAHIR', label: 'Tanggal Lahir' },
                { key: 'JENIS KELAMIN', label: 'Jenis Kelamin' },
                { key: 'NOMOR WHATSAPP', label: 'Nomor WhatsApp' },
                { key: 'EMAIL', label: 'Email' },
                { key: 'SKEMA SERTIFIKASI YANG DIIKUTI', label: 'Skema Sertifikasi' },
                { key: 'TAHUN AJARAN', label: 'Tahun Ajaran' }
              ]} 
            />
          )}
          {view === 'master-skema' && (
            <MasterDataView 
              title="Data Unit Kompetensi" 
              sheetName="DATA UNIT KOMPETENSI" 
              idColumn="KODE UNIT"
              columns={[
                { key: 'KODE UNIT', label: 'Kode Unit' },
                { key: 'JUDUL UNIT', label: 'Judul Unit' },
                { key: 'JENIS UNIT', label: 'Jenis Unit (Inti/Pilihan)' }
              ]} 
            />
          )}
          {view === 'master-users' && (
            <MasterDataView 
              title="Akses Pengguna" 
              sheetName="User_Auth" 
              idColumn="UserID"
              columns={[
                { key: 'UserID', label: 'UserID' },
                { key: 'Username', label: 'Username' },
                { key: 'Password_Hash', label: 'Password' },
                { key: 'Role', label: 'Role' },
                { key: 'Nama', label: 'Nama' },
                { key: 'NISN', label: 'NISN (Opsional)' }
              ]} 
            />
          )}
          {view === 'verification' && <AdminVerification />}
          {view === 'recap' && <DirekturDashboard />}
        </div>
      </main>
    </div>
  );
}

// --- Nav Item Component ---
function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[14px] font-medium ${
        active 
          ? 'bg-[#F1F5F9] text-accent' 
          : 'text-text-muted hover:text-text-main hover:bg-[#F8FAFC]'
      }`}
    >
      <span className={active ? 'text-accent' : 'text-text-muted/60'}>{icon}</span>
      {label}
    </button>
  );
}

// --- Login View ---
function LoginView({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await callGasAction({ action: 'login', username, password });
      
      if (res.status === 'success') {
        onLogin(res.user as User);
      } else {
        setError(res.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
       <div className="grid lg:grid-cols-2 max-w-5xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-border-subtle">
          {/* Left: Branding */}
          <div className="bg-[#F1F5F9] p-16 flex flex-col justify-between text-text-main hidden lg:flex border-r border-border-subtle relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
             
             <div className="relative z-10">
                <div className="w-16 h-16 mb-8 flex items-center justify-center bg-white rounded-2xl shadow-xl shadow-black/5 p-2">
                   <img 
                     src="https://lh3.googleusercontent.com/d/1INrEt4FMNAuKzkDe2lZaQVcYFOc8f9YN" 
                     alt="Logo LSP SMK TP1" 
                     className="w-full h-full object-contain"
                     referrerPolicy="no-referrer"
                   />
                </div>
                <h2 className="text-4xl font-bold tracking-tight leading-tight text-text-main">
                  Manajemen Sertifikasi <br />
                  <span className="text-accent underline decoration-accent/20 underline-offset-8">LSP SMK TP1</span>
                </h2>
                <p className="mt-8 text-text-muted max-w-sm font-medium leading-relaxed">
                  Standar pengelolaan pendaftaran asesi yang transparan, akuntabel, dan didukung kecerdasan buatan.
                </p>
             </div>

             <div className="relative z-10">
                <div className="flex gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-bg-main"></div>)}
                  </div>
                  <p className="text-xs font-semibold text-text-muted flex items-center">+250 Asesi telah tersertifikasi</p>
                </div>
             </div>
          </div>

          {/* Right: Form */}
          <div className="p-10 lg:p-20 flex flex-col justify-center">
             <div className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-text-main tracking-tight">Login Sistem</h3>
                <p className="text-sm text-text-muted mt-2">Gunakan akun i-SMK untuk melanjutkan.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-6">
                <div>
                   <label className="block text-[12px] font-bold text-text-main mb-2">Username / NISN</label>
                   <input 
                     type="text" 
                     required
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full px-5 py-4 bg-[#F8FAFC] border border-border-subtle rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-sm font-medium"
                     placeholder="Masukkan username atau NISN..."
                   />
                </div>
                <div>
                   <label className="block text-[12px] font-bold text-text-main mb-2">Password</label>
                   <input 
                     type="password" 
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full px-5 py-4 bg-[#F8FAFC] border border-border-subtle rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-sm font-medium"
                     placeholder="••••••••"
                   />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-medium animate-shake">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-blue-700 text-white py-4.5 rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait mt-4 flex items-center justify-center gap-2 shadow-lg shadow-accent/25"
                >
                  {loading ? 'MENYAMBUNGKAN...' : 'MASUK KE DASHBOARD'}
                </button>
             </form>
             
             <div className="mt-12 text-center">
                <p className="text-xs text-text-muted font-medium">Bantuan? <span className="text-accent hover:underline cursor-pointer">Lupa Password</span></p>
             </div>
          </div>
       </div>
    </div>
  );
}

// --- Dashboard View ---
function DashboardView({ user, setView }: { user: User, setView: (v: string) => void }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await callGasAction({ 
          action: 'readData', 
          type: 'Data_APL01', 
          userId: user?.userId 
        });
        if (res.status === 'success') {
          setSubmissions(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [user]);

  const latestSub = submissions.length > 0 ? submissions[submissions.length - 1] : null;

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-border-subtle flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-text-muted animate-pulse">MENYINGKRONKAN STATUS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center bg-white p-8 rounded-3xl border border-border-subtle shadow-sm mb-6">
        <div>
          <h2 className="text-3xl font-bold text-text-main tracking-tight">Selamat Datang, {user?.nama || 'Pengguna'}</h2>
          <div className="flex items-center gap-2 mt-2">
             <span className="px-2.5 py-0.5 bg-accent text-white text-[10px] font-black rounded-md uppercase tracking-wider">ROLE: {user?.role || 'GUEST'}</span>
             <p className="text-sm text-text-muted font-medium italic">Sistem Manajemen LSP SMK Tanjung Priok 1</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wide ${
            user?.role === 'ADMIN' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            {user?.role === 'ADMIN' ? 'Full System Access' : 'Siswa Aktif'}
          </span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          icon={<ShieldCheck className="text-accent" size={24} />}
          label="Pengajuan APL-01"
          value={latestSub ? latestSub[6] || latestSub['Status'] : 'Belum Mulai'}
          status={latestSub ? (latestSub[6] === 'Verified' ? 'success' : 'pending') : 'none'}
        />
        <StatCard 
          icon={<ClipboardList className="text-emerald-500" size={24} />}
          label="Proses Sertifikasi"
          value={latestSub ? (latestSub[6] === 'Verified' ? 'Asesmen Mandiri' : 'Menunggu Approval') : 'Idle'}
          status="complete"
        />
        <StatCard 
          icon={<Download className="text-indigo-500" size={24} />}
          label="Sertifikat / Bukti"
          value={latestSub?.[6] === 'Verified' ? 'Download APL' : 'N/A'}
          status={latestSub?.[6] === 'Verified' ? 'ai' : 'none'}
          subValue={latestSub?.[6] === 'Verified' ? "Klik untuk Unduh" : ""}
          onClick={() => latestSub?.[6] === 'Verified' && window.print()}
        />
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        <section className="bg-white p-10 rounded-3xl border border-border-subtle shadow-sm overflow-hidden relative">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-bold text-text-main tracking-tight">Tracking Progress Sertifikasi</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 text-accent rounded-lg text-[10px] font-bold border border-accent/10">
                 REAL-TIME UPDATE
              </div>
           </div>

           <div className="relative pb-10">
              <div className="absolute top-5 left-8 right-8 h-1 bg-bg-main"></div>
              <div className="relative flex justify-between">
                 <ProgressStep active={!!latestSub} done={!!latestSub} label="Pendaftaran" sub="APL-01 Submitted" />
                 <ProgressStep active={latestSub?.[6] === 'Verified'} done={latestSub?.[6] === 'Verified'} label="Verifikasi" sub="Approved by Admin" />
                 <ProgressStep active={latestSub?.[6] === 'Verified'} done={false} label="Asesmen Mandiri" sub="Isi Form APL-02" />
                 <ProgressStep active={false} done={false} label="Keluaran Sertifikat" sub="Pending Result" />
              </div>
           </div>
           
           {!latestSub && (
             <div className="mt-8 p-12 text-center border-2 border-dashed border-border-subtle rounded-3xl bg-bg-main/30">
                <p className="text-text-muted font-bold text-sm">Anda belum memulai perjalanan sertifikasi.</p>
                <button 
                  onClick={() => setView('apl01')}
                  className="mt-6 px-10 py-4 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-105 transition-all"
                >
                  DAFTAR SEKARANG
                </button>
             </div>
           )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, status, subValue, onClick }: { icon: React.ReactNode, label: string, value: string, status: string, subValue?: string, onClick?: () => void }) {
  const badgeStyles: any = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    complete: "bg-blue-50 text-blue-700 border-blue-100",
    ai: "bg-indigo-50 text-indigo-700 border-indigo-100",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    none: "bg-gray-50 text-gray-400 border-gray-100"
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-8 rounded-3xl border border-border-subtle shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-accent' : ''}`}
    >
      <div className="mb-4">{icon}</div>
      <p className="text-[11px] uppercase font-bold text-text-muted tracking-widest mb-1.5">{label}</p>
      <p className="text-2xl font-black text-text-main mb-4 truncate">{value}</p>
      <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeStyles[status] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
        {status === 'success' ? 'Terverifikasi' : status === 'complete' ? 'Lengkap' : status === 'ai' ? (subValue || 'Active') : status === 'pending' ? 'Diproses' : 'Tersedia'}
      </div>
    </div>
  );
}

function ActivityRow({ unit, title, bukti, reco, isSpecial = false }: { unit: string, title: string, bukti: string, reco: string, isSpecial?: boolean }) {
  return (
    <div className="grid grid-cols-3 px-6 py-5 border-b last:border-0 border-border-subtle items-center hover:bg-bg-main transition-colors">
       <div className="text-sm">
          <span className="font-bold text-text-main">{unit}</span>
          <span className="text-text-muted block mt-0.5">{title}</span>
       </div>
       <div className="text-xs font-medium text-text-muted">{bukti}</div>
       <div className={`text-xs font-bold ${isSpecial ? 'text-accent' : 'text-emerald-600'}`}>{reco}</div>
    </div>
  );
}

function ActivityItem({ date, text }: { date: string, text: string }) {
  return (
    <div className="flex gap-4 items-start border-l-2 border-border-subtle pl-4 pb-4">
      <div className="min-w-[80px] text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">{date}</div>
      <div className="text-sm font-medium text-text-main leading-tight">{text}</div>
    </div>
  );
}

function ProgressStep({ active, done, label, sub }: { active: boolean, done: boolean, label: string, sub: string }) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
       <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-sm ${
         done ? 'bg-emerald-500 border-emerald-500 text-white' : 
         active ? 'bg-accent border-accent text-white animate-pulse shadow-accent/20' : 
         'bg-white border-border-subtle text-text-muted'
       }`}>
          {done ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
       </div>
       <div className="text-center">
          <p className={`text-[11px] font-black uppercase tracking-widest ${active || done ? 'text-text-main' : 'text-text-muted font-bold'}`}>{label}</p>
          <p className="text-[9px] text-text-muted font-medium mt-1 uppercase">{sub}</p>
       </div>
    </div>
  );
}

// --- Asesi APL-01 Form ---
function AsesiAPL01({ user, onComplete }: { user: User, onComplete: (regId: string) => void }) {
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    nisn: user?.nisn || '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    kebangsaan: 'Indonesia',
    alamat: '',
    kota: 'Jakarta Utara',
    kodePos: '14310',
    noHp: '',
    email: '',
    pendidikan: 'SMK',
    namaSkema: 'Junior Operator Desain Grafis',
    tujuanAsesmen: 'Sertifikasi',
    linkBerkas: '',
    ttdAsesi: user?.nama || ''
  });
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [fetchingStudents, setFetchingStudents] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await callGasAction({ action: 'readData', type: 'DATA SISWA' });
        if (res.status === 'success') {
          setStudents(res.data);
        } else {
          console.error("Gagal memuat data siswa:", res.message);
        }
      } catch (err) {
        console.error("Gagal memuat data siswa:", err);
      } finally {
        setFetchingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await callGasAction({ 
        action: 'saveAPL01', 
        userId: user?.userId || 'unknown',
        namaSkema: formData.namaSkema,
        alamat: formData.alamat,
        linkBerkas: formData.linkBerkas,
        ttdAsesi: user?.nama || '',
        nik: formData.nik,
        tempatLahir: formData.tempatLahir,
        tanggalLahir: formData.tanggalLahir,
        jenisKelamin: formData.jenisKelamin,
        noHp: formData.noHp,
        email: formData.email,
        pendidikan: formData.pendidikan,
        tujuanAsesmen: formData.tujuanAsesmen
      });
      if (res.status === 'success') {
        onComplete(res.idReg);
      }
    } catch (err) {
      alert("Gagal mengirim permohonan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-border-subtle animate-in zoom-in-95 duration-300">
      <div className="mb-10 border-b border-border-subtle pb-8">
         <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">TAHAP 01</span>
            <h2 className="text-3xl font-bold tracking-tight text-text-main">Permohonan Sertifikasi</h2>
         </div>
         <p className="text-sm text-text-muted font-medium">Lengkapi data diri dan unggah berkas persyaratan administrasi.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Bagian 1: Data Pribadi */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center font-black">1</div>
              <h3 className="text-lg font-bold text-text-main">Data Pribadi Asesi</h3>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="form-group">
                    <Label text="Nama Lengkap" />
                    <input 
                      required
                      value={formData.nama} 
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                       <Label text="Tempat Lahir" />
                       <input required value={formData.tempatLahir} onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none" />
                    </div>
                    <div className="form-group">
                       <Label text="Tanggal Lahir" />
                       <input required type="date" value={formData.tanggalLahir} onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none" />
                    </div>
                 </div>
                 <div className="form-group">
                    <Label text="NIK / No KTP" />
                    <input required value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none" placeholder="16 digit NIK..." />
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="form-group">
                    <Label text="Jenis Kelamin" />
                    <div className="flex gap-4">
                       {['Laki-laki', 'Perempuan'].map(jk => (
                          <label key={jk} className="flex-1 cursor-pointer">
                             <input type="radio" name="jk" checked={formData.jenisKelamin === jk} onChange={() => setFormData({...formData, jenisKelamin: jk})} className="sr-only peer" />
                             <div className="py-3 text-center rounded-xl border border-border-subtle peer-checked:border-accent peer-checked:bg-accent/5 peer-checked:text-accent text-text-muted text-xs font-bold transition-all">{jk}</div>
                          </label>
                       ))}
                    </div>
                 </div>
                 <div className="form-group">
                    <Label text="Alamat Rumah" />
                    <textarea 
                      required
                      rows={3}
                      value={formData.alamat}
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                      className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none"
                    ></textarea>
                 </div>
              </div>
           </div>
        </section>

        {/* Bagian 2: Kontak & Pendidikan */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center font-black">2</div>
              <h3 className="text-lg font-bold text-text-main">Kontak & Pendidikan</h3>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="form-group">
                    <Label text="Nomor HP / WhatsApp" />
                    <input required type="tel" value={formData.noHp} onChange={(e) => setFormData({...formData, noHp: e.target.value})} className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none" />
                 </div>
                 <div className="form-group">
                    <Label text="Email" />
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none" />
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="form-group">
                    <Label text="Pendidikan Terakhir" />
                    <select value={formData.pendidikan} onChange={(e) => setFormData({...formData, pendidikan: e.target.value})} className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none">
                       <option>SMP</option>
                       <option>SMK</option>
                       <option>Diploma</option>
                       <option>Sarjana</option>
                    </select>
                 </div>
                 <div className="form-group">
                    <Label text="Tujuan Asesmen" />
                    <select value={formData.tujuanAsesmen} onChange={(e) => setFormData({...formData, tujuanAsesmen: e.target.value})} className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none">
                       <option>Sertifikasi</option>
                       <option>Sertifikasi Ulang</option>
                       <option>Pengakuan Kompetensi Terkini (PKT)</option>
                    </select>
                 </div>
              </div>
           </div>
        </section>

        {/* Bagian 3: Skema & Portofolio */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center font-black">3</div>
              <h3 className="text-lg font-bold text-text-main">Data Sertifikasi</h3>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              <div className="form-group">
                 <Label text="Skema Sertifikasi yang Diikuti" />
                 <select 
                   value={formData.namaSkema} 
                   onChange={(e) => setFormData({...formData, namaSkema: e.target.value})}
                   className="w-full px-5 py-3.5 bg-bg-main border border-border-subtle rounded-2xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none"
                 >
                    <option>Junior Operator Desain Grafis</option>
                    <option>Junior Content Creator</option>
                 </select>
              </div>
              <div className="form-group">
                 <Label text="Link Folder Drive Portofolio (KTP/Rapor/Karya)" />
                 <input 
                   required
                   type="url"
                   value={formData.linkBerkas}
                   onChange={(e) => setFormData({...formData, linkBerkas: e.target.value})}
                   className="w-full px-5 py-3.5 bg-[#F8FAFC] border border-border-subtle rounded-2xl text-xs font-mono focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none"
                   placeholder="https://drive.google.com/..."
                 />
                 <p className="mt-3 text-[10px] text-text-muted font-bold italic uppercase tracking-wider">Gabungkan semua file dalam 1 folder drive</p>
              </div>
           </div>
        </section>

        <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-border-subtle flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-md">
              <p className="text-[11px] uppercase tracking-[0.2em] font-black text-text-muted mb-2">Konfirmasi Integritas</p>
              <p className="text-xs text-text-main font-bold leading-relaxed">
                 Saya menandatangani dokumen ini sebagai bukti bahwa saya telah membaca, memahami, dan menyetujui seluruh ketentuan sertifikasi di LSP SMK Tanjung Priok 1.
              </p>
           </div>
           <div className="bg-white px-10 py-6 rounded-2xl shadow-xl shadow-black/5 border border-border-subtle min-w-[280px] text-center italic font-serif text-2xl text-accent border-b-4 border-b-accent">
              {user?.nama}
           </div>
        </div>

        <div className="flex justify-end pt-6">
          <button 
             type="submit" 
             disabled={loading}
             className="w-full md:w-auto px-12 py-5 bg-accent text-white rounded-2xl font-black tracking-widest hover:bg-blue-700 hover:shadow-2xl shadow-accent/20 transition-all flex items-center justify-center gap-4"
          >
            {loading ? 'MENYIMPAN DATA...' : 'SUBMIT PENDAFTARAN & LANJUT KE APL-02'}
            <Plus size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Asesi APL-02 View ---
function AsesiAPL02({ user, idReg, onComplete }: { user: User, idReg: string | null, onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [units, setUnits] = useState<any[]>([]);
  const [fetchingUnits, setFetchingUnits] = useState(true);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await callGasAction({ action: 'readData', type: 'DATA UNIT KOMPETENSI' });
        if (res.status === 'success') {
          setUnits(res.data);
          setAnswers(res.data.map(() => ({ k: true, link: '' })));
        } else {
          console.error("Gagal memuat unit kompetensi:", res.message);
          // Fallback if sheet empty
          const fallback = [
            { 'Kode Unit': 'M.74100.001.02', 'Judul Unit': 'Mengaplikasikan Prinsip Dasar Desain' },
            { 'Kode Unit': 'M.74100.002.02', 'Judul Unit': 'Menerapkan Pengetahuan Desain' },
            { 'Kode Unit': 'M.74100.009.02', 'Judul Unit': 'Menciptakan Karya Desain' },
            { 'Kode Unit': 'M.74100.010.02', 'Judul Unit': 'Mempresentasikan Karya Desain' }
          ];
          setUnits(fallback);
          setAnswers(fallback.map(() => ({ k: true, link: '' })));
        }
      } catch (err) {
        console.error("Gagal memuat unit:", err);
      } finally {
        setFetchingUnits(false);
      }
    };
    fetchUnits();
  }, []);

  const handleAiCheck = async (index: number) => {
    const unit = units[index];
    const kode = unit['KODE UNIT'] || unit['Kode Unit'] || unit['kode'];
    if (kode !== 'M.74100.009.02') return;
    if (!answers[index].link) return alert("Harap isi link bukti terlebih dahulu");

    setAiLoading(true);
    const res = await verifyDesignPortfolio(answers[index].link, "Seorang asesi sedang mengumpulkan karya desain untuk sertifikasi LSP.");
    setAiStatus(res);
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const unitPayload = units.map((unit, idx) => ({
        kodeUnit: unit['KODE UNIT'] || unit['Kode Unit'] || unit['kode'],
        judulUnit: unit['JUDUL UNIT'] || unit['Judul Unit'] || unit['judul'],
        jawaban: answers[idx].k ? 'K' : 'BK',
        linkBukti: answers[idx].link
      }));

      await callGasAction({ 
        action: 'saveAPL02', 
        idReg: idReg,
        units: unitPayload 
      });
      onComplete();
    } catch (err) {
      alert("Gagal menyimpan data APL-02");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUnits) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-border-subtle flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-text-muted animate-pulse tracking-wide">MEMUAT DAFTAR UNIT KOMPETENSI...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-border-subtle animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-10 border-b border-border-subtle pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <div className="flex items-center gap-3 mb-3">
               <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">TAHAP 02</span>
               <h2 className="text-3xl font-bold tracking-tight text-text-main">Ceklis Mandiri</h2>
            </div>
            <p className="text-sm text-text-muted font-medium">Asesmen mandiri untuk menentukan kesiapan sertifikasi.</p>
         </div>
         <div className="px-5 py-3 bg-bg-main border border-border-subtle rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/15">
              <ShieldCheck size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-text-main uppercase tracking-tight">AI INTEGRATION</p>
               <p className="text-[11px] text-accent font-bold">Verification Mode ON</p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full text-left">
             <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-widest text-text-muted border-b border-border-subtle">
                <tr>
                   <th className="px-8 py-5">Kode & Unit Kompetensi</th>
                   <th className="px-8 py-5 text-center">Penilaian</th>
                   <th className="px-8 py-5">Bukti Pendukung (URL)</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border-subtle">
                {units.map((unit, idx) => {
                   const kode = unit['KODE UNIT'] || unit['Kode Unit'] || unit['kode'];
                   const judul = unit['JUDUL UNIT'] || unit['Judul Unit'] || unit['judul'];
                   
                   return (
                     <tr key={idx} className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="font-mono text-[10px] font-bold text-accent mb-1">{kode}</p>
                           <p className="font-bold text-text-main text-sm leading-snug">{judul}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex justify-center gap-4">
                              <label className="cursor-pointer group">
                                 <input type="radio" name={`ans-${idx}`} checked={answers[idx]?.k} onChange={() => {
                                   const newAns = [...answers];
                                   newAns[idx].k = true;
                                   setAnswers(newAns);
                                 }} className="sr-only peer" />
                                 <div className="w-10 h-10 rounded-xl border-2 border-border-subtle flex items-center justify-center peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white text-text-muted font-bold transition-all text-sm">K</div>
                              </label>
                              <label className="cursor-pointer group">
                                 <input type="radio" name={`ans-${idx}`} checked={!answers[idx]?.k} onChange={() => {
                                   const newAns = [...answers];
                                   newAns[idx].k = false;
                                   setAnswers(newAns);
                                 }} className="sr-only peer" />
                                 <div className="w-10 h-10 rounded-xl border-2 border-border-subtle flex items-center justify-center peer-checked:border-red-500 peer-checked:bg-red-500 peer-checked:text-white text-text-muted font-bold transition-all text-sm">BK</div>
                              </label>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex gap-2">
                             <input 
                               required
                               type="url"
                               value={answers[idx]?.link || ''}
                               onChange={(e) => {
                                 const newAns = [...answers];
                                 newAns[idx].link = e.target.value;
                                 setAnswers(newAns);
                               }}
                               className="flex-1 px-4 py-2.5 bg-bg-main border border-border-subtle rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent"
                               placeholder="Link Bukti..."
                             />
                             {kode === 'M.74100.009.02' && (
                               <button 
                                 type="button"
                                 onClick={() => handleAiCheck(idx)}
                                 className="px-3 bg-text-main text-white rounded-xl hover:bg-black transition-colors"
                               >
                                  <ShieldCheck size={16} />
                               </button>
                             )}
                           </div>
                           {idx === 2 && aiLoading && <p className="text-[11px] text-accent mt-2 animate-pulse font-bold italic">AI sedang memproses berkas...</p>}
                           {idx === 2 && aiStatus && (
                              <div className={`mt-3 p-4 rounded-xl text-xs flex items-start gap-3 border ${aiStatus.isDesign ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                                 <div className={`p-1.5 rounded-lg ${aiStatus.isDesign ? 'bg-emerald-200' : 'bg-red-200'}`}>
                                   {aiStatus.isDesign ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                 </div>
                                 <div>
                                    <p className="font-black uppercase tracking-tight mb-1">Hasil Verifikasi AI ({Math.round(aiStatus.confidence * 100)}%)</p>
                                    <p className="font-medium opacity-80">{aiStatus.explanation}</p>
                                 </div>
                              </div>
                           )}
                        </td>
                     </tr>
                   );
                })}
             </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center bg-bg-main p-8 rounded-3xl border border-border-subtle gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-accent border border-border-subtle">
                 <ClipboardList size={24} />
              </div>
              <div className="text-xs text-text-muted font-bold uppercase tracking-tight leading-relaxed">
                 K = Kompeten (Punya Bukti)<br />
                 BK = Belum Kompeten (Butuh Pelatihan)
              </div>
           </div>
           <button 
             type="submit"
             disabled={loading}
             className="w-full md:w-auto px-10 py-5 bg-text-main text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-3"
           >
              {loading ? 'MENYIMPAN DATA...' : 'SELESAIKAN PENDAFTARAN'}
              <CheckCircle2 size={20} />
           </button>
        </div>
      </form>
    </div>
  );
}

// --- Admin Master Data View ---
function MasterDataView({ title, sheetName, idColumn, columns }: { title: string, sheetName: string, idColumn: string, columns: {key: string, label: string}[] }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [sheetName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await callGasAction({ action: 'readData', type: sheetName });
      console.log(`GAS Response for ${sheetName}:`, res);
      if (res.status === 'success') {
        setData(res.data);
      } else {
        console.warn(`GAS Error for ${sheetName}:`, res.message);
        alert(`Gagal mengambil data ${sheetName}: ${res.message}`);
      }
    } catch (err) {
      console.error(`Fetch Error for ${sheetName}:`, err);
      alert(`Terjadi kesalahan koneksi saat memuat ${sheetName}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload: any = {};
    columns.forEach(col => {
      payload[col.key] = formData.get(col.key);
    });

    try {
      await callGasAction({ 
        action: 'saveData', 
        sheetName, 
        idColumn, 
        payload 
      });
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Hapus data ini?")) return;
    try {
      await callGasAction({ 
        action: 'deleteData', 
        sheetName, 
        idColumn, 
        idValue: id 
      });
      fetchData();
    } catch (err) {
      alert("Gagal menghapus data");
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) return;
    
    // Header
    const headers = columns.map(col => col.label).join(',');
    
    // Rows
    const rows = data.map(item => {
      return columns.map(col => {
        const val = item[col.key] || "";
        return `"${val.toString().replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LSP_Export_${sheetName.replace(/ /g, '_')}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-border-subtle shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main">{title}</h2>
          <p className="text-sm text-text-muted mt-1 font-medium">Pengelolaan data master di sheet {sheetName}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            disabled={loading || data.length === 0}
            className="flex items-center gap-2 bg-white border border-border-subtle text-text-main px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-bg-main transition-all disabled:opacity-50"
          >
            <Download size={18} />
            EKSPOR CSV
          </button>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={18} />
            TAMBAH DATA
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border-subtle shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-main border-b border-border-subtle text-[11px] font-bold text-text-muted uppercase tracking-widest">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-8 py-5">{col.label}</th>
                ))}
                <th className="px-8 py-5 text-right whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center text-text-muted">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-bold animate-pulse">Memuat Data...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center text-text-muted font-medium">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-bg-main/50 transition-colors">
                    {columns.map(col => (
                      <td key={col.key} className="px-8 py-5 text-sm text-text-main font-medium">
                        {item[col.key]}
                      </td>
                    ))}
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item[idColumn])}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-border-subtle flex justify-between items-center">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit Data' : 'Tambah Data Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-bg-main rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid gap-4">
                  {columns.map(col => (
                    <div key={col.key}>
                      <label className="block text-[11px] font-bold text-text-muted uppercase mb-1.5 ml-1">{col.label}</label>
                      <input 
                        name={col.key}
                        defaultValue={editingItem ? editingItem[col.key] : ''}
                        required={col.key !== 'NISN'}
                        readOnly={editingItem && col.key === idColumn}
                        className={`w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent ${editingItem && col.key === idColumn ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-border-subtle rounded-xl font-bold text-sm hover:bg-bg-main transition-colors"
                  >
                    BATAL
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold text-sm shadow-lg shadow-accent/15 transition-all"
                  >
                    SIMPAN PERUBAHAN
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

// --- Admin Verification View ---
function AdminVerification() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await callGasAction({ action: 'readData', type: 'Data_APL01' });
      if (res.status === 'success') {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat antrean:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (idReg: string, status: string) => {
    if (!confirm(`Ubah status pengajuan ${idReg} menjadi ${status}?`)) return;
    
    try {
      const res = await callGasAction({ 
        action: 'updateStatus', 
        idReg: idReg, 
        status: status 
      });
      if (res.status === 'success') {
        alert("Status berhasil diperbarui");
        fetchSubmissions();
      } else {
        alert("Gagal: " + res.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem");
    }
  };

  const filtered = submissions.filter(s => s[6] === filter || (!s[6] && filter === 'Pending'));

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-text-main">Verifikasi Berkas</h2>
            <p className="text-sm text-text-muted font-medium mt-1">Review pendaftaran asesi dan hasil pengecekan portofolio AI.</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-border-subtle">
             {['Pending', 'Verified', 'Rejected'].map(st => (
               <button 
                key={st}
                onClick={() => setFilter(st)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === st ? 'bg-[#F1F5F9] text-accent' : 'text-text-muted hover:bg-bg-main'}`}
               >
                 {st}
               </button>
             ))}
          </div>
       </div>

       <div className="bg-white rounded-3xl shadow-sm border border-border-subtle overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted border-b border-border-subtle">
                <tr>
                   <th className="px-8 py-5">ID REGISTRASI</th>
                   <th className="px-8 py-5">NAMA ASESI</th>
                   <th className="px-8 py-5">TGL DAFTAR</th>
                   <th className="px-8 py-5">STATUS</th>
                   <th className="px-8 py-5 text-right whitespace-nowrap">AKSI</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border-subtle">
                {loading ? (
                   <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-text-muted animate-pulse font-bold">MENYINKRONKAN DATABASE...</td>
                   </tr>
                ) : filtered.length === 0 ? (
                   <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-text-muted font-medium">Tidak ada antrean dalam kategori ini.</td>
                   </tr>
                ) : filtered.map((s, idx) => (
                   <tr key={idx} className="hover:bg-bg-main transition-colors">
                      <td className="px-8 py-6 font-mono text-xs font-bold text-accent">{s[0]}</td>
                      <td className="px-8 py-6">
                         <p className="font-bold text-text-main">{s[1]}</p>
                         <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide mt-0.5">{s[3]}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-text-muted">{new Date(s[2]).toLocaleDateString()}</td>
                      <td className="px-8 py-6">
                         <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                           s[6] === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                           s[6] === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                           'bg-yellow-50 text-yellow-600 border-yellow-100'
                         }`}>
                           {s[6] || 'Pending'}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex justify-end gap-2">
                           {filter === 'Pending' && (
                             <>
                               <button 
                                 onClick={() => handleUpdateStatus(s[0], 'Verified')}
                                 className="px-3 py-2 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-100"
                               >Setujui</button>
                               <button 
                                 onClick={() => handleUpdateStatus(s[0], 'Rejected')}
                                 className="px-3 py-2 text-[10px] font-black uppercase text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-100"
                               >Tolak</button>
                             </>
                           )}
                           <a 
                             href={s[5]} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="px-3 py-2 text-[10px] font-black uppercase text-accent bg-accent/5 hover:bg-accent/10 rounded-lg transition-all border border-accent/10"
                           >Berkas</a>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

// --- Direktur Dashboard View ---
function DirekturDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callGasAction({ action: 'readData', type: 'Data_APL01' });
        if (res.status === 'success') {
          setData(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat data rekap:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = data.length;
  const kompeten = data.filter(s => s[6] === 'Verified').length;
  const rejected = data.filter(s => s[6] === 'Rejected').length;
  const pending = data.filter(s => !s[6] || s[6] === 'Pending').length;

  const exportRekapCSV = () => {
    if (data.length === 0) return;
    const headers = "ID Reg,Nama,Tanggal,Skema,Alamat,Link,Status";
    const rows = data.map(s => s.join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `REKAP_LSP_${new Date().getTime()}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-border-subtle flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-text-muted animate-pulse font-mono tracking-widest text-xs">MENGKALKULASI DATA REAL-TIME...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in zoom-in-95 duration-500">
       <div className="bg-white p-10 rounded-3xl border border-border-subtle shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-text-main">Ringkasan Kinerja LSP</h2>
            <p className="text-sm text-text-muted font-medium mt-1">Laporan rekapitulasi sertifikasi SMK Tanjung Priok 1.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={exportRekapCSV}
                className="flex items-center gap-3 bg-white border border-border-subtle text-text-main px-8 py-4 rounded-2xl font-bold text-sm hover:bg-bg-main transition-all"
             >
                <Download size={20} />
                EKSPOR CSV
             </button>
             <button 
               onClick={() => window.print()}
               className="flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-2xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-xl shadow-accent/20 transition-all"
             >
                <Printer size={20} />
                CETAK PDF
             </button>
          </div>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MetricCard label="TOTAL ASESI" value={total.toString()} change={`${total > 0 ? '100%' : '0%'}`} />
          <MetricCard label="KOMPETEN" value={kompeten.toString()} change={`${total > 0 ? Math.round((kompeten/total)*100) : 0}%`} color="text-emerald-500" />
          <MetricCard label="BELUM KOMPETEN" value={rejected.toString()} change={`${total > 0 ? Math.round((rejected/total)*100) : 0}%`} color="text-red-500" />
          <MetricCard label="PROSES VERIFIKASI" value={pending.toString()} change={`${total > 0 ? Math.round((pending/total)*100) : 0}%`} color="text-accent" />
       </div>

       <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white p-10 rounded-3xl border border-border-subtle shadow-sm">
             <h3 className="text-lg font-bold flex items-center gap-3 mb-10">
                <PieChart className="text-accent" size={24} />
                Distribusi Berdasarkan Skema
             </h3>
             <div className="space-y-8">
                <ProgressItem label="Junior Operator Desain Grafis" value={data.filter(s => s[3].includes('Desain')).length > 0 ? Math.round((data.filter(s => s[3].includes('Desain')).length / total)*100) : 0} color="bg-accent" />
                <ProgressItem label="Lainnya" value={data.filter(s => !s[3].includes('Desain')).length > 0 ? Math.round((data.filter(s => !s[3].includes('Desain')).length / total)*100) : 0} color="bg-emerald-500" />
             </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-bg-main p-8 rounded-3xl border border-border-subtle flex items-center justify-between">
                <div>
                   <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Otomatisasi</p>
                   <p className="font-bold text-lg text-text-main leading-tight">Cetak APL-01 & 02<br />ke Format Resmi</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-accent border border-border-subtle">
                   <FileCheck size={24} />
                </div>
             </div>
             <div className="bg-accent p-10 rounded-3xl text-white flex flex-col justify-between h-56 shadow-2xl shadow-accent/20 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="flex justify-between items-start relative z-10">
                   <ShieldCheck size={36} className="text-blue-100" />
                   <span className="text-[10px] font-bold tracking-widest bg-blue-500/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 uppercase">Core System Online</span>
                </div>
                <p className="text-[15px] font-medium leading-relaxed relative z-10">Data tersinkronisasi otomatis dengan server pusat i-SMK LSP TP1.</p>
             </div>
          </div>
       </div>
    </div>
  );
}

function MetricCard({ label, value, change, color="text-text-main" }: { label: string, value: string, change: string, color?: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-border-subtle shadow-sm">
       <p className="text-[11px] uppercase font-bold text-text-muted tracking-widest mb-3">{label}</p>
       <div className="flex items-end justify-between">
          <p className={`text-4xl font-black tracking-tighter ${color}`}>{value}</p>
          <span className="text-[11px] font-bold text-emerald-500 mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">{change}</span>
       </div>
    </div>
  );
}

function ProgressItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between text-xs font-bold">
          <span className="text-text-muted">{label}</span>
          <span className="text-text-main">{value}%</span>
       </div>
       <div className="h-2.5 bg-bg-main rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className={`h-full ${color} rounded-full`} 
          />
       </div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <label className="block text-[11px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">{text}</label>;
}
