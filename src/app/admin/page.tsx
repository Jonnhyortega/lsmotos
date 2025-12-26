
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Mail, 
  LogOut, 
  User, 
  CheckSquare, 
  Square,
  Send,
  MoreHorizontal,
  Settings,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Overlay } from '@/components/ui/Overlay';
import { logos } from '@/constants/logos';

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  type: 'Distributor' | 'Newsletter';
  date: string;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Cargando...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}

function AdminPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  
  // Reset Password State
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newResetPwd, setNewResetPwd] = useState('');
  
  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Persistence Load & URL Check
  useEffect(() => {
    // 1. Check if we are in Reset Mode or Verify Email Mode
    const token = searchParams.get('token');
    const verifyEmailToken = searchParams.get('verify_email_token');

    if (token) {
        setResetToken(token);
        setShowResetModal(true);
    }

    if (verifyEmailToken) {
        verifyEmailChange(verifyEmailToken);
    }

    // 2. Load Session & Fetch Me
    const checkSession = async () => {
        const sessionLocal = localStorage.getItem('ls_admin_session');
        if (sessionLocal === 'true') {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setIsAuthenticated(true);
                    // setAdminEmail(data.email); // Handled by Dashboard
                    // setEmailForm(data.email);
                } else {
                   // Session invalid
                   handleLogout();
                }
            } catch (e) {
                handleLogout();
            }
        }
    };
    checkSession();
  }, [searchParams]);

  const verifyEmailChange = async (token: string) => {
      try {
          const res = await fetch('/api/auth/verify-email-change', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
          });
          if (res.ok) {
              alert('Correo actualizado correctamente. Por favor inicia sesión nuevamente.');
              router.push('/admin');
          } else {
              alert('Token de verificación inválido o expirado.');
          }
      } catch (e) {
          alert('Error verificando correo.');
      }
  };

  // Real Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });
        
        if (res.ok) {
            setIsAuthenticated(true);
            localStorage.setItem('ls_admin_session', 'true');
        } else {
            alert('Credenciales inválidas');
        }
    } catch (err) {
        alert('Error al intentar ingresar');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ls_admin_session');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail })
        });
        alert('Si el correo existe, se enviará un enlace de recuperación.');
        setShowForgotModal(false);
    } catch (err) {
        alert('Error al procesar solicitud');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: resetToken, newPassword: newResetPwd })
        });

        if (res.ok) {
            alert('Contraseña restablecida con éxito. Por favor inicia sesión.');
            setShowResetModal(false);
            setResetToken(null);
            router.push('/admin'); // Clear URL
        } else {
            alert('Error: El token puede haber expirado.');
        }
    } catch (err) {
        alert('Error al restablecer contraseña');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ls-dark text-ls-light">
        <form onSubmit={handleLogin} className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-wider mb-2" style={{ fontFamily: 'var(--font-imax)' }}>ACCESO ADMIN</h1>
            <p className="text-gray-400">Panel de control Motos LS</p>
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ls-accent transition-colors mb-4"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
             <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ls-accent transition-colors"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            INGRESAR
          </Button>
          <div className="text-center">
            <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs text-gray-500 hover:text-white underline">
                ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        {/* Forgot Password Modal */}
        <Overlay isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} title="Recuperar Contraseña">
             <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-sm text-gray-400">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
                <input 
                    type="email" 
                    placeholder="Email registrado"
                    className="w-full p-3 bg-black/20 border border-white/10 rounded text-white focus:border-ls-accent outline-none"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                />
                <Button type="submit" className="w-full">Enviar Enlace</Button>
             </form>
        </Overlay>

        {/* Reset Password Modal (Triggered by URL) */}
        <Overlay isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Nueva Contraseña">
             <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-sm text-gray-400">Ingresa tu nueva contraseña para recuperar el acceso.</p>
                <input 
                    type="password" 
                    placeholder="Nueva Contraseña"
                    className="w-full p-3 bg-black/20 border border-white/10 rounded text-white focus:border-ls-accent outline-none"
                    value={newResetPwd}
                    onChange={(e) => setNewResetPwd(e.target.value)}
                />
                <Button type="submit" className="w-full">Guardar Contraseña</Button>
             </form>
        </Overlay>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

interface DashboardProps {
    onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Distributor' | 'Newsletter'>('All');
  const [showMailModal, setShowMailModal] = useState(false);

  // Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Password State
  const [pwdFormData, setPwdFormData] = useState({ current: '', new: '', confirm: '' });
  const [pwdVisibility, setPwdVisibility] = useState({ current: false, new: false, confirm: false });
  const [pwdStatus, setPwdStatus] = useState<{ type: 'error' | 'success' | null, msg: string }>({ type: null, msg: '' });

  // Email State
  const [adminEmail, setAdminEmail] = useState('');
  const [emailForm, setEmailForm] = useState(''); 
  const [emailStatus, setEmailStatus] = useState<{ type: 'error' | 'success' | null, msg: string }>({ type: null, msg: '' });

  // Fetch Admin Data
  useEffect(() => {
      const fetchCtx = async () => {
          try {
              const res = await fetch('/api/auth/me');
              if (res.ok) {
                  const data = await res.json();
                  setAdminEmail(data.email);
                  setEmailForm(data.email);
              }
          } catch(e) { console.error(e); }
      };
      fetchCtx();
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/admin/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        } else {
          console.error("Failed to fetch customers");
          // Fallback mock
          setCustomers([
            { id: '1', name: 'Juan Perez', email: 'juan@taller.com', city: 'Buenos Aires', type: 'Distributor', date: '2025-01-10T14:00:00Z' },
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomers();
  }, []);

  // Filter Logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(prev => prev !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Actions
  const exportToGmail = () => {
    const selectedCustomers = customers.filter(c => selectedIds.includes(c.id));
    const emails = selectedCustomers.map(c => c.email);
    const bccList = emails.join(',');
    window.location.href = `mailto:?bcc=${bccList}&subject=Información%20Motos%20LS`;
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus({ type: null, msg: '' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm)) {
        setEmailStatus({ type: 'error', msg: 'Formato de correo inválido.' });
        return;
    }

    try {
        setEmailStatus({ type: null, msg: 'Enviando solicitud...' });
        const res = await fetch('/api/auth/request-email-change', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newEmail: emailForm })
        });

        if (res.ok) {
            setEmailStatus({ type: 'success', msg: 'Se ha enviado un enlace de verificación al nuevo correo.' });
        } else {
            const data = await res.json();
            setEmailStatus({ type: 'error', msg: data.error || 'Error al solicitar cambio.' });
        }
    } catch(e) {
        setEmailStatus({ type: 'error', msg: 'Error de conexión.' });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus({ type: null, msg: '' });
    // Pending API implementation
    alert("Para cambiar configuraciones de seguridad, implementaremos el endpoint proximamente.");
  };

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
      setPwdVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  }

  return (
    <div className="min-h-screen bg-ls-dark text-ls-light p-4 md:p-10 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 md:mb-10 gap-6">
        <div className='flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left w-full xl:w-auto'>
          <Image src={logos.whiteLogo} className="drop-shadow-2xl-[10px_10px_10px_rgba(255,0,0,0.5)]" alt="Logo" width={80} height={80} />
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-white mb-1" style={{ fontFamily: 'var(--font-imax)' }}>
              DASHBOARD <span className="text-ls-accent">LEADS</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base">Gestión de Suscriptores y Distribuidores</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 w-full xl:w-auto">
          <div className="bg-white/5 rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 max-w-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
            <span className="text-sm font-medium hidden sm:inline shrink-0">Admin Activo</span>
            <span className="text-xs text-white/40 border-l border-white/10 pl-2 ml-2 truncate max-w-[150px]">{adminEmail || 'Cargando...'}</span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSettingsModal(true)} title="Configuración" className="hover:bg-ls-accent hover:text-ls-dark transition-colors">
              <Settings className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={onLogout} title="Cerrar Sesión">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Search & Filter */}
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg focus:border-ls-accent focus:outline-none transition-all placeholder:text-white/20 text-sm md:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {(['All', 'Distributor', 'Newsletter'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap ${
                  filterType === type 
                    ? 'bg-ls-accent/10 border-ls-accent text-ls-accent' 
                    : 'bg-[#1A1A1A] border-white/10 text-white/50 hover:bg-white/5'
                }`}
              >
                {type === 'All' ? 'Todos' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 flex justify-end gap-3 h-12">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-2 w-full md:w-auto"
              >
                <Button variant="secondary" onClick={exportToGmail} className="gap-2 flex-1 md:flex-none justify-center">
                  <Mail className="w-4 h-4" />
                  <span className="inline">Exportar</span>
                </Button>
                <Button variant="primary" onClick={() => setShowMailModal(true)} className="gap-2 flex-1 md:flex-none justify-center">
                  <Send className="w-4 h-4" />
                  <span className="inline">Mensaje</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE LIST VIEW (Cards) */}
      <div className="md:hidden space-y-4 mb-8">
        <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-white/40 text-xs uppercase font-bold tracking-wider">Resultados ({filteredCustomers.length})</h3>
            <button 
                onClick={toggleSelectAll} 
                className="flex items-center gap-2 text-xs text-ls-accent uppercase font-bold tracking-wider"
            >
                {selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                    <>Deseleccionar todos <CheckSquare className="w-4 h-4" /></>
                ) : (
                    <>Seleccionar todos <Square className="w-4 h-4" /></>
                )}
            </button>
        </div>

        {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
                <div 
                    key={customer.id} 
                    className={`bg-[#1A1A1A] border ${selectedIds.includes(customer.id) ? 'border-ls-accent/50 bg-ls-accent/[0.03]' : 'border-white/5'} rounded-xl p-4 transition-all`}
                    onClick={() => toggleSelect(customer.id)}
                >
                    <div className="flex items-start gap-4">
                        <div onClick={(e) => { e.stopPropagation(); toggleSelect(customer.id); }} className="mt-1">
                             {selectedIds.includes(customer.id) ? (
                                <CheckSquare className="w-6 h-6 text-ls-accent" />
                            ) : (
                                <Square className="w-6 h-6 text-white/20" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-ls-accent font-bold text-sm shrink-0">
                                    {customer.name.charAt(0)}
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                                    customer.type === 'Distributor' 
                                    ? 'bg-ls-accent/10 border-ls-accent text-ls-accent' 
                                    : 'bg-purple-500/10 border-purple-500 text-purple-400'
                                }`}>
                                    {customer.type}
                                </span>
                            </div>
                            
                            <h4 className="font-semibold text-white truncate text-lg leading-tight mb-1">{customer.name}</h4>
                            <p className="text-white/50 text-sm truncate mb-3">{customer.email}</p>
                            
                            <div className="flex items-center justify-between text-xs text-white/30 border-t border-white/5 pt-3">
                                <span className="flex items-center gap-1 truncate max-w-[60%]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span> {customer.city || 'Sin ciudad'}
                                </span>
                                <span className="font-mono">{new Date(customer.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-10 text-white/30 bg-[#1A1A1A] rounded-xl border border-white/5">
                No se encontraron resultados
            </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-xs uppercase tracking-wider text-white/40">
                <th className="p-4 w-12 text-center">
                  <button onClick={toggleSelectAll} className="opacity-60 hover:opacity-100 transition-opacity">
                    {selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-ls-accent" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-medium">Usuario</th>
                <th className="p-4 font-medium">Ubicación</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium text-right">Fecha</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className={`group transition-colors hover:bg-white/[0.02] ${selectedIds.includes(customer.id) ? 'bg-ls-accent/[0.03]' : ''}`}
                  >
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelect(customer.id)} className="opacity-40 group-hover:opacity-100 transition-opacity">
                        {selectedIds.includes(customer.id) ? (
                          <CheckSquare className="w-5 h-5 text-ls-accent" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-ls-accent font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{customer.name}</div>
                          <div className="text-sm text-white/50">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">{customer.city}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        customer.type === 'Distributor' 
                          ? 'bg-ls-accent/10 border-ls-accent text-ls-accent' 
                          : 'bg-purple-500/10 border-purple-500 text-purple-400'
                      }`}>
                        {customer.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right text-white/40 font-mono text-xs">
                      {new Date(customer.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-white/30">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/40 justify-center sm:justify-start">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Total: <strong className="text-white">{customers.length}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ls-accent"></span>
          <span>Distribuidores: <strong className="text-white">{customers.filter(c => c.type === 'Distributor').length}</strong></span>
        </div>
      </div>

      {/* MAIL MODAL */}
      {showMailModal && (
        <Overlay isOpen={showMailModal} onClose={() => setShowMailModal(false)} title="Redactar Correo Masivo">
            <p className="text-sm text-white/60 mb-6">
              Enviando a <strong>{selectedIds.length}</strong> destinatarios seleccionados.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Asunto</label>
                <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm" placeholder="Novedades Motos LS..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Mensaje</label>
                <textarea rows={4} className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm" placeholder="Escribe tu mensaje aquí..."></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setShowMailModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => { alert('Función de envío simulada!'); setShowMailModal(false); }}>
                Enviar Ahora
              </Button>
            </div>
        </Overlay>
      )}

      {/* SETTINGS MODAL */}
      <Overlay isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Configuración de Cuenta">
        <div className="space-y-8">
            
            {/* Email Section */}
            <section>
                <h4 className="flex items-center gap-2 text-white font-bold mb-4 border-b border-white/10 pb-2">
                    <Mail size={18} className="text-ls-accent" /> Correo Electrónico
                </h4>
                <form onSubmit={handleEmailChange} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Email de Administrador</label>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                className="flex-1 bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm"
                                value={emailForm}
                                onChange={(e) => setEmailForm(e.target.value)}
                            />
                            <Button type="submit" size="sm" variant="secondary">Guardar</Button>
                        </div>
                    </div>
                    {emailStatus.msg && (
                        <div className={`p-2 rounded text-xs flex items-center gap-2 ${emailStatus.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            {emailStatus.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                            {emailStatus.msg}
                        </div>
                    )}
                </form>
            </section>

            {/* Password Section */}
            <section>
                <h4 className="flex items-center gap-2 text-white font-bold mb-4 border-b border-white/10 pb-2">
                     <Settings size={18} className="text-ls-accent" /> Seguridad
                </h4>
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="bg-ls-accent/5 p-4 rounded-lg border border-ls-accent/10 mb-6">
                        <h4 className="flex items-center gap-2 text-ls-accent text-sm font-bold mb-2">
                            <AlertCircle size={16} /> Requisitos de contraseña
                        </h4>
                        <ul className="text-xs text-white/60 space-y-1 ml-6 list-disc">
                            <li>Entre 8 y 16 caracteres.</li>
                            <li>Al menos 1 mayúscula.</li>
                            <li>Al menos 1 carácter especial (!@#$%...).</li>
                        </ul>
                    </div>

                    {/* Current Password */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Contraseña Actual</label>
                        <div className="relative">
                            <input 
                                type={pwdVisibility.current ? "text" : "password"}
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm pr-10"
                                value={pwdFormData.current}
                                onChange={(e) => setPwdFormData({...pwdFormData, current: e.target.value})}
                            />
                            <button type="button" onClick={() => toggleVisibility('current')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                                {pwdVisibility.current ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* New Password */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Nueva</label>
                            <div className="relative">
                                <input 
                                    type={pwdVisibility.new ? "text" : "password"}
                                    className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm pr-10"
                                    value={pwdFormData.new}
                                    onChange={(e) => setPwdFormData({...pwdFormData, new: e.target.value})}
                                />
                                <button type="button" onClick={() => toggleVisibility('new')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                                    {pwdVisibility.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Confirmar</label>
                            <div className="relative">
                                <input 
                                    type={pwdVisibility.confirm ? "text" : "password"}
                                    className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm pr-10"
                                    value={pwdFormData.confirm}
                                    onChange={(e) => setPwdFormData({...pwdFormData, confirm: e.target.value})}
                                />
                                <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                                    {pwdVisibility.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {pwdStatus.msg && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${pwdStatus.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                            {pwdStatus.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                            {pwdStatus.msg}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="primary" size="sm">Actualizar Contraseña</Button>
                    </div>
                </form>
            </section>
        </div>
      </Overlay>

    </div>
  );
}
