
'use client';

import { useState, useEffect } from 'react';
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
  Lock,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('admin123'); // Dynamic internal state
  const [adminEmail, setAdminEmail] = useState('No hay correo configurado'); // Dynamic internal state
  
  // Persistence Load
  useEffect(() => {
    // 1. Load Session
    const sessionLocal = localStorage.getItem('ls_admin_session');
    const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('ls_admin_session='));
    
    if (sessionLocal === 'true' || sessionCookie) {
        setIsAuthenticated(true);
    }

    // 2. Load Config
    const storedPwd = localStorage.getItem('ls_admin_pwd');
    const storedEmail = localStorage.getItem('ls_admin_email');

    if (storedPwd) setAdminPassword(storedPwd);
    if (storedEmail) setAdminEmail(storedEmail);
  }, []);

  // Login Simulator
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === adminPassword) {
      setIsAuthenticated(true);
      // Save Session
      localStorage.setItem('ls_admin_session', 'true');
      document.cookie = "ls_admin_session=true; path=/; max-age=86400; SameSite=Strict"; // 1 day
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ls_admin_session');
    document.cookie = "ls_admin_session=; path=/; max-age=0";
  };

  const persistPassword = (newPwd: string) => {
      setAdminPassword(newPwd);
      localStorage.setItem('ls_admin_pwd', newPwd);
  };

  const persistEmail = (newEmail: string) => {
      setAdminEmail(newEmail);
      localStorage.setItem('ls_admin_email', newEmail);
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
          <p className="text-xs text-center text-gray-500 mt-4">Contraseña actual: {adminPassword}</p>
        </form>
      </div>
    );
  }

  return <Dashboard 
            adminPassword={adminPassword} 
            adminEmail={adminEmail}
            onPasswordChange={persistPassword} 
            onEmailChange={persistEmail}
            onLogout={handleLogout} 
          />;
}

interface DashboardProps {
    adminPassword: string;
    adminEmail: string;
    onPasswordChange: (newPwd: string) => void;
    onEmailChange: (newEmail: string) => void;
    onLogout: () => void;
}

function Dashboard({ adminPassword, adminEmail, onPasswordChange, onEmailChange, onLogout }: DashboardProps) {
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
  const [emailForm, setEmailForm] = useState(adminEmail);
  const [emailStatus, setEmailStatus] = useState<{ type: 'error' | 'success' | null, msg: string }>({ type: null, msg: '' });

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

  // Password Change Logic
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus({ type: null, msg: '' });

    // 1. Check current password
    if (pwdFormData.current !== adminPassword) {
        setPwdStatus({ type: 'error', msg: 'La contraseña actual es incorrecta.' });
        return;
    }

    // 2. Validate complexity
    // 1 uppercase, 1 special char, 8-16 chars
    const complexityRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!complexityRegex.test(pwdFormData.new)) {
        setPwdStatus({ 
            type: 'error', 
            msg: 'La contraseña debe tener entre 8-16 caracteres, 1 mayúscula y 1 carácter especial.' 
        });
        return;
    }

    // 3. Match new and confirm
    if (pwdFormData.new !== pwdFormData.confirm) {
        setPwdStatus({ type: 'error', msg: 'Las contraseñas nuevas no coinciden.' });
        return;
    }

    // Success
    onPasswordChange(pwdFormData.new);
    setPwdStatus({ type: 'success', msg: '¡Contraseña actualizada correctamente!' });
    
    // Reset form
    setTimeout(() => {
        setShowSettingsModal(false);
        setPwdFormData({ current: '', new: '', confirm: '' });
        setPwdStatus({ type: null, msg: '' });
    }, 2000);
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus({ type: null, msg: '' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm)) {
        setEmailStatus({ type: 'error', msg: 'Formato de correo inválido.' });
        return;
    }

    onEmailChange(emailForm);
    setEmailStatus({ type: 'success', msg: 'Correo actualizado correctamente.' });
  };

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
      setPwdVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  }

  return (
    <div className="min-h-screen bg-ls-dark text-ls-light p-6 md:p-10 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className='flex gap-4'>
          <Image src={logos.whiteLogo} className="m-auto drop-shadow-2xl-[10px_10px_10px_rgba(255,0,0,0.5)]" alt="Logo" width={100} height={100} />
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-white mb-2" style={{ fontFamily: 'var(--font-imax)' }}>
            DASHBOARD <span className="text-ls-accent">LEADS</span>
          </h1>
          <p className="text-white/60">Gestión de Suscriptores y Distribuidores</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium hidden sm:inline">Admin Activo</span>
            <span className="text-xs text-white/40 border-l border-white/10 pl-2 ml-2">{adminEmail}</span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => setShowSettingsModal(true)} title="Configuración" className="hover:bg-ls-accent hover:text-ls-dark transition-colors">
            <Settings className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onLogout} title="Cerrar Sesión">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Search & Filter */}
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg focus:border-ls-accent focus:outline-none transition-all placeholder:text-white/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {(['All', 'Distributor', 'Newsletter'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
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
        <div className="lg:col-span-4 flex justify-end gap-3">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-2"
              >
                <Button variant="secondary" onClick={exportToGmail} className="gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="hidden md:inline">Gmail Export</span>
                </Button>
                <Button variant="primary" onClick={() => setShowMailModal(true)} className="gap-2">
                  <Send className="w-4 h-4" />
                  <span className="hidden md:inline">Enviar Masivo</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
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
      <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/40">
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


