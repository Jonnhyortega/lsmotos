
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
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  Edit2,
  MessageSquare, 
  MapPin, 
  Facebook, 
  Instagram, 
  Smartphone, 
  Globe,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Overlay } from '@/components/ui/Overlay';
import { logos } from '@/constants/logos';
import { BrandLoader } from '@/components/ui/BrandLoader';
import { ConfirmDialog, DialogVariant } from '@/components/ui/ConfirmDialog';

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
    <Suspense fallback={<BrandLoader size="fullscreen" />}>
      <AdminPageContent />
    </Suspense>
  );
}

function AdminPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: DialogVariant;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'info'
  });

  // Loading States
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  
  // Reset Password State
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newResetPwd, setNewResetPwd] = useState('');
  
  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ls_admin_session');
  };

  const verifyEmailChange = async (token: string) => {
      try {
          const res = await fetch('/api/auth/verify-email-change', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
          });
          if (res.ok) {
              setDialogConfig({
                isOpen: true,
                title: 'Correo Actualizado',
                description: 'El correo se ha actualizado correctamente. Por favor inicia sesión nuevamente.',
                variant: 'success',
                onConfirm: () => router.push('/admin')
              });
          } else {
              setDialogConfig({
                isOpen: true,
                title: 'Error',
                description: 'Token de verificación inválido o expirado.',
                variant: 'error'
              });
          }
      } catch (e) {
          setDialogConfig({
            isOpen: true,
            title: 'Error',
            description: 'Ocurrió un error verificando el correo.',
            variant: 'error'
          });
      }
  };

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
                    // const data = await res.json();
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
        setIsInitialLoading(false);
    };
    
    // Slight delay to ensure smooth transition
    setTimeout(() => {
        checkSession();
    }, 500);

  }, [searchParams]);

  if (isInitialLoading) {
      return <BrandLoader size="fullscreen" />;
  }

  // Real Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
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
            setDialogConfig({
                isOpen: true,
                title: 'Error de Acceso',
                description: 'Las credenciales ingresadas son incorrectas.',
                variant: 'error'
            });
        }
    } catch (err) {
        setDialogConfig({
            isOpen: true,
            title: 'Error de Conexión',
            description: 'No se pudo conectar con el servidor. Intenta nuevamente.',
            variant: 'error'
        });
    } finally {
        setIsLoggingIn(false);
    }
  };


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail })
        });
        
        setShowForgotModal(false);
        setDialogConfig({
            isOpen: true,
            title: 'Solicitud Enviada',
            description: 'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.',
            variant: 'success'
        });
    } catch (err) {
        setDialogConfig({
            isOpen: true,
            title: 'Error',
            description: 'Ocurrió un error al procesar la solicitud.',
            variant: 'error'
        });
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
            setShowResetModal(false);
            setResetToken(null);
            router.push('/admin'); // Clear URL
            
            setDialogConfig({
                isOpen: true,
                title: 'Contraseña Actualizada',
                description: 'Tu contraseña ha sido restablecida correctamente. Por favor inicia sesión.',
                variant: 'success'
            });
        } else {
            setDialogConfig({
                isOpen: true,
                title: 'Error',
                description: 'El token es inválido o ha expirado.',
                variant: 'error'
            });
        }
    } catch (err) {
        setDialogConfig({
            isOpen: true,
            title: 'Error',
            description: 'No se pudo restablecer la contraseña.',
            variant: 'error'
        });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ls-dark text-ls-light">
        <form onSubmit={handleLogin} className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-wider mb-2" style={{ fontFamily: 'var(--font-imax)' }}>ACCESO ADMIN</h1>
            <p className="text-gray-400">Panel de control <span className="font-imax text-ls-accent">Motos LS</span></p>
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ls-accent transition-colors mb-4"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
             <div className="relative">
              <input 
                type={showLoginPassword ? "text" : "password"} 
                placeholder="Contraseña" 
                className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ls-accent transition-colors pr-10"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
             </div>
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
        {/* Confirm Dialog */}
        <ConfirmDialog 
            isOpen={dialogConfig.isOpen}
            onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
            title={dialogConfig.title}
            description={dialogConfig.description}
            variant={dialogConfig.variant}
            onConfirm={dialogConfig.onConfirm}
        />

        {/* Login Loader Overlay */}
        {isLoggingIn && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <BrandLoader />
            </div>
        )}
      </div>
    );
  }

  const showDialog = (config: { title: string; description: string; variant?: DialogVariant; onConfirm?: () => void }) => {
      setDialogConfig({
          isOpen: true,
          variant: 'info',
          ...config
      });
  };

  return (
    <>
      <Dashboard onLogout={handleLogout} showDialog={showDialog} />
      <ConfirmDialog 
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
        title={dialogConfig.title}
        description={dialogConfig.description}
        variant={dialogConfig.variant}
        onConfirm={dialogConfig.onConfirm}
      />
    </>
  );
}

interface DashboardProps {
    onLogout: () => void;
    showDialog: (config: { title: string; description: string; variant?: DialogVariant; onConfirm?: () => void }) => void;
}

interface EmailLog {
  id: string;
  subject: string;
  message: string;
  recipients: number;
  status: string;
  date: string;
}

function Dashboard({ onLogout, showDialog }: DashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Distributor' | 'Newsletter'>('All');
  
  // View Mode
  const [viewMode, setViewMode] = useState<'subscribers' | 'logs'>('subscribers');
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const [showMailModal, setShowMailModal] = useState(false);
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);

  // Fetch Logs
  useEffect(() => {
      if (viewMode === 'logs') {
          fetch('/api/admin/emails-log')
            .then(res => res.json())
            .then(data => setEmailLogs(data))
            .catch(err => console.error(err));
      }
  }, [viewMode]);



  const handleSendBulkEmail = async () => {
      if (!mailSubject.trim() || !mailMessage.trim()) return;
      
      setIsSendingMail(true);
      try {
          const res = await fetch('/api/admin/send-bulk-email', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 subject: mailSubject,
                 message: mailMessage,
                 recipientIds: selectedIds
             })
          });

          const data = await res.json();

          if (res.ok) {
              setMailSubject('');
              setMailMessage('');
              setShowMailModal(false);
              showDialog({ 
                  title: 'Reporte de Envío', 
                  description: data.message || 'Proceso finalizado.', 
                  variant: 'success' 
              });
          } else {
             // Construct a more detailed error message
             let errorMsg = data.error || 'No se pudieron enviar los correos.';
             if (data.details && Array.isArray(data.details)) {
                 errorMsg += `\n\nDetalles:\n` + data.details.slice(0, 3).join('\n') + (data.details.length > 3 ? `\n... y ${data.details.length - 3} más.` : '');
             }

             showDialog({ 
                  title: 'Error en el Envío', 
                  description: errorMsg, 
                  variant: 'error' 
              });
          }
      } catch (e) {
          showDialog({ 
              title: 'Error', 
              description: 'Ocurrió un error de conexión.', 
              variant: 'error' 
          });
      } finally {
          setIsSendingMail(false);
      }
  };

  const handleDelete = (idsToDelete: string[]) => {
    console.log(idsToDelete)  
    showDialog({

        title: 'Confirmar Eliminación',
        description: `¿Estás seguro que deseas eliminar ${idsToDelete.length} usuario(s)? Esta acción no se puede deshacer.`,
        variant: 'error',
        onConfirm: async () => {
             try {  
                const res = await fetch('/api/admin/customers', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: idsToDelete })
                });
                
                if (res.ok) {
                    setCustomers(prev => prev.filter(c => !idsToDelete.includes(c.id)));
                    setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
                    // We don't need to show another dialog for success strictly, but it's nice.
                    // However, calling showDialog again immediately might conflict if not handled well. 
                    // But standard react state updates usually batch or replace. 
                    // Let's just close it by default logic of ConfirmDialog if it auto-closes, 
                    // but here we are using a custom dialog handler.
                    // The ConfirmDialog in AdminPage likely stays open until closed.
                    // Actually checking AdminPageContent, <ConfirmDialog ... onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))} />
                    // So we might need to manually close it, but onConfirm usually is just an action.
                    // The ConfirmDialog implementation usually closes itself on confirm? Check ConfirmDialog usage.
                    // If unsure, I'll assume I can just leave it or show success.
                } else {
                    showDialog({ title: 'Error', description: 'No se pudieron eliminar los suscriptores.', variant: 'error' });
                }
             } catch (e) {
                 showDialog({ title: 'Error', description: 'Error de conexión.', variant: 'error' });
             }
        }
    });
  };

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
  // Actions
  const exportToCSV = () => {
    const selectedCustomers = customers.filter(c => selectedIds.includes(c.id));
    
    // Define Headers
    const headers = ['Nombre', 'Email', 'Ciudad', 'Tipo', 'Fecha de Registro'];
    
    // Map Data
    const rows = selectedCustomers.map(c => [
        c.name,
        c.email,
        c.city,
        c.type === 'Distributor' ? 'Distribuidor' : 'Newsletter',
        new Date(c.date).toLocaleDateString()
    ]);

    // Build CSV String
    const csvContent = [
        headers.join(','), 
        ...rows.map(row => row.map(item => `"${item}"`).join(',')) // Quote fields to handle commas in data
    ].join('\n');

    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clientes_ls_motos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus({ type: null, msg: '' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm)) {
        setEmailStatus({ type: 'error', msg: 'Formato de correo inválido.' });
        return;
    }

    if (emailForm === adminEmail) {
        setEmailStatus({ type: 'error', msg: 'El correo ingresado es igual al actual.' });
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus({ type: null, msg: '' });

    if (!pwdFormData.current || !pwdFormData.new || !pwdFormData.confirm) {
        setPwdStatus({ type: 'error', msg: 'Todos los campos son obligatorios.' });
        return;
    }

    if (pwdFormData.current === pwdFormData.new) {
        setPwdStatus({ type: 'error', msg: 'La nueva contraseña no puede ser igual a la actual.' });
        return;
    }

    if (pwdFormData.new !== pwdFormData.confirm) {
        setPwdStatus({ type: 'error', msg: 'Las contraseñas no coinciden.' });
        return;
    }

    if (pwdFormData.new.length < 8) {
        setPwdStatus({ type: 'error', msg: 'La contraseña debe tener al menos 8 caracteres.' });
        return;
    }

    try {
        setPwdStatus({ type: null, msg: 'Actualizando...' });
        const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                currentPassword: pwdFormData.current, 
                newPassword: pwdFormData.new 
            })
        });

        const data = await res.json();

        if (res.ok) {
            setPwdStatus({ type: 'success', msg: 'Contraseña actualizada correctamente.' });
            setPwdFormData({ current: '', new: '', confirm: '' });
            setTimeout(() => {
                setPwdStatus({ type: null, msg: '' });
                setShowSettingsModal(false);
            }, 2000);
        } else {
            setPwdStatus({ type: 'error', msg: data.error || 'Error al actualizar.' });
        }
    } catch (err) {
        setPwdStatus({ type: 'error', msg: 'Error de conexión.' });
    }
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
        {/* Search & Filter */}
        <div className="lg:col-span-8 flex flex-col gap-4">
             {/* View Switcher */}
             <div className="flex bg-[#1A1A1A] p-1 rounded-lg border border-white/10 w-fit">
                <button 
                    onClick={() => setViewMode('subscribers')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'subscribers' ? 'bg-ls-accent text-ls-dark shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Suscriptores
                </button>
                <button 
                     onClick={() => setViewMode('logs')}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'logs' ? 'bg-ls-accent text-ls-dark shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Historial de Correos
                </button>
             </div>

          {viewMode === 'subscribers' && (
          <div className="flex flex-col md:flex-row gap-4 w-full">
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
          )}
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

                <Button variant="secondary" onClick={exportToCSV} className="gap-2 flex-1 md:flex-none justify-center">
                  <Download className="w-4 h-4" />
                  <span className="inline">Exportar Excel</span>
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

      {viewMode === 'subscribers' ? (
      <>
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
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleDelete([customer.id]); 
                        }}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-500 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-5 h-5" />
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
      </>
      ) : (
        // EMAIL LOGS VIEW
        <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02] text-xs uppercase tracking-wider text-white/40">
                                <th className="p-4 font-medium">Asunto</th>
                                <th className="p-4 font-medium text-center">Destinatarios</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 font-medium text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {emailLogs.length > 0 ? (
                                emailLogs.map((log) => (
                                    <tr 
                                        key={log.id} 
                                        className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                    <Mail size={16} />
                                                </div>
                                                <span className="font-semibold text-white">{log.subject}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-white/70">{log.recipients}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full text-[10px] font-bold border uppercase bg-green-500/10 border-green-500 text-green-400">
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-white/40 font-mono text-xs">
                                            {new Date(log.date).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-16 text-center text-white/30">
                                        <div className="flex flex-col items-center gap-4">
                                            <Mail size={40} className="opacity-50" />
                                            <p>No hay historial de correos enviados.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Disclaimer */}
            <p className="text-xs text-white/20 text-center italic">
                * El historial muestra los correos enviados recientemente. Haga clic en una fila para ver el detalle.
            </p>
        </div>
      )}

      {/* EMAIL DETAIL MODAL */}
      {selectedLog && (
        <Overlay isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Detalle del Correo">
             <div className="space-y-6">
                 <div>
                     <h4 className="text-xs font-bold text-white/40 mb-1 uppercase">Asunto</h4>
                     <p className="text-xl font-semibold text-white">{selectedLog.subject}</p>
                 </div>
                 
                 <div className="flex gap-8 border-b border-white/10 pb-4">
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase">Destinatarios</h4>
                         <p className="text-white">{selectedLog.recipients}</p>
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase">Fecha</h4>
                         <p className="text-white">{new Date(selectedLog.date).toLocaleString()}</p>
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase">Estado</h4>
                         <span className="text-green-400 text-sm font-bold uppercase">{selectedLog.status}</span>
                     </div>
                 </div>

                 <div>
                     <h4 className="text-xs font-bold text-white/40 mb-2 uppercase">Mensaje</h4>
                     <div className="bg-black/20 border border-white/10 rounded-lg p-4 text-white/80 font-mono text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                         {selectedLog.message}
                     </div>
                 </div>

                 <div className="flex justify-end pt-2">
                     <Button variant="ghost" onClick={() => setSelectedLog(null)}>Cerrar</Button>
                 </div>
             </div>
        </Overlay>
      )}

      {/* MAIL MODAL */}
      {showMailModal && (
        <Overlay isOpen={showMailModal} onClose={() => setShowMailModal(false)} title="Redactar Correo Masivo">
            <p className="text-sm text-white/60 mb-6">
              Enviando a <strong>{selectedIds.length}</strong> destinatarios seleccionados.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Asunto</label>
                <input 
                    type="text" 
                    className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm" 
                    placeholder="Novedades Motos LS..." 
                    value={mailSubject}
                    onChange={(e) => setMailSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Mensaje</label>
                <textarea 
                    rows={4} 
                    className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none font-mono text-sm" 
                    placeholder="Escribe tu mensaje aquí..."
                    value={mailMessage}
                    onChange={(e) => setMailMessage(e.target.value)}
                ></textarea>
                <p className="text-xs text-white/30 mt-1">Usa {"{{name}}"} para insertar el nombre del destinatario.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setShowMailModal(false)} disabled={isSendingMail}>Cancelar</Button>
              <Button variant="primary" onClick={handleSendBulkEmail} disabled={isSendingMail || !mailSubject.trim() || !mailMessage.trim()}>
                {isSendingMail ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Enviando...</> : 'Enviar Ahora'}
              </Button>
            </div>
        </Overlay>
      )}

      {/* SETTINGS MODAL */}
      <Overlay isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Configuración de Cuenta">
        <SettingsContent 
            adminEmail={adminEmail} 
            onClose={() => setShowSettingsModal(false)}
        />
      </Overlay>
    </div>
  );
}

// Extract Settings Content to manage Accordion State cleanly
function SettingsContent({ adminEmail, onClose }: { adminEmail: string, onClose: () => void }) {
    const [expanded, setExpanded] = useState<'email' | 'security' | 'site' | null>(null);
    const [requestPasswordMode, setRequestPasswordMode] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Site Config State
    const [siteConfig, setSiteConfig] = useState({
        whatsapp: '',
        instagram: '',
        email: '',
        facebook: '',
        address: '',
        mapsLink: '',
        showWhatsapp: true,
        showInstagram: true,
        showFacebook: true,
        showEmail: true,
        showAddress: true,

        showMapsLink: true,
        tiktok: '',
        showTiktok: true
    });
    const [siteStatus, setSiteStatus] = useState<{ type: 'error' | 'success' | null, msg: string }>({ type: null, msg: '' });

    // Fetch Site Config
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/admin/config');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setSiteConfig({
                            whatsapp: data.whatsapp || '',
                            instagram: data.instagram || '',
                            email: data.email || '',
                            facebook: data.facebook || '',
                            address: data.address || '',
                            mapsLink: data.mapsLink || '',
                            showWhatsapp: data.showWhatsapp !== undefined ? data.showWhatsapp : true,
                            showInstagram: data.showInstagram !== undefined ? data.showInstagram : true,
                            showFacebook: data.showFacebook !== undefined ? data.showFacebook : true,
                            showEmail: data.showEmail !== undefined ? data.showEmail : true,
                            showAddress: data.showAddress !== undefined ? data.showAddress : true,
                            showMapsLink: data.showMapsLink !== undefined ? data.showMapsLink : true,
                            tiktok: data.tiktok || '',
                            showTiktok: data.showTiktok !== undefined ? data.showTiktok : true
                        });
                    }
                }
            } catch (e) {
                console.error("Error fetching site config", e);
            }
        };
        fetchConfig();
    }, []);

    const handleSaveSiteConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        setSiteStatus({ type: null, msg: 'Guardando...' });
        
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siteConfig)
            });
            
            if (res.ok) {
                setSiteStatus({ type: 'success', msg: 'Información actualizada correctamente.' });
            } else {
                setSiteStatus({ type: 'error', msg: 'Error al guardar.' });
            }
        } catch(e) {
            setSiteStatus({ type: 'error', msg: 'Error de conexión.' });
        }
    };
    
    // Email Form
    const [emailForm, setEmailForm] = useState(adminEmail);
    const [emailStatus, setEmailStatus] = useState<{ type: 'error' | 'success' | null, msg: string }>({ type: null, msg: '' });

    // Password Form
    const [pwdFormData, setPwdFormData] = useState({ current: '', new: '', confirm: '' });
    const [pwdVisibility, setPwdVisibility] = useState({ current: false, new: false, confirm: false });
    const [pwdStatus, setPwdStatus] = useState<{ type: 'error' | 'success' | null, msg: string }>({ type: null, msg: '' });

    const toggleAccordion = (section: 'email' | 'security' | 'site') => {
        setExpanded(expanded === section ? null : section);
    };

    const handleEmailSaveClick = (e: React.FormEvent) => {
        e.preventDefault();
        setEmailStatus({ type: null, msg: '' });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailForm)) {
            setEmailStatus({ type: 'error', msg: 'Formato de correo inválido.' });
            return;
        }

        if (emailForm === adminEmail) {
            setEmailStatus({ type: 'error', msg: 'El correo ingresado es igual al actual.' });
            return;
        }

        // Show password prompt
        setRequestPasswordMode(true);
    };

    const handleConfirmEmailChange = async () => {
        if (!confirmPassword) return;

        try {
            setEmailStatus({ type: null, msg: 'Verificando...' });
            
            const res = await fetch('/api/auth/request-email-change', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    newEmail: emailForm,
                    currentPassword: confirmPassword 
                })
            });

            const data = await res.json();

            if (res.ok) {
                setEmailStatus({ type: 'success', msg: 'Enlace enviado. Revisa tu nuevo correo.' });
                setRequestPasswordMode(false);
                setConfirmPassword('');
            } else {
                setEmailStatus({ type: 'error', msg: data.error || 'Error al procesar.' });
            }
        } catch(e) {
            setEmailStatus({ type: 'error', msg: 'Error de conexión.' });
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdStatus({ type: null, msg: '' });
    
        if (!pwdFormData.current || !pwdFormData.new || !pwdFormData.confirm) {
            setPwdStatus({ type: 'error', msg: 'Todos los campos son obligatorios.' });
            return;
        }
    
        if (pwdFormData.current === pwdFormData.new) {
            setPwdStatus({ type: 'error', msg: 'La nueva contraseña no puede ser igual a la actual.' });
            return;
        }
    
        if (pwdFormData.new !== pwdFormData.confirm) {
            setPwdStatus({ type: 'error', msg: 'Las contraseñas no coinciden.' });
            return;
        }
    
        if (pwdFormData.new.length < 8) {
            setPwdStatus({ type: 'error', msg: 'La contraseña debe tener al menos 8 caracteres.' });
            return;
        }
    
        try {
            setPwdStatus({ type: null, msg: 'Actualizando...' });
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    currentPassword: pwdFormData.current, 
                    newPassword: pwdFormData.new 
                })
            });
    
            const data = await res.json();
    
            if (res.ok) {
                setPwdStatus({ type: 'success', msg: 'Contraseña actualizada correctamente.' });
                setPwdFormData({ current: '', new: '', confirm: '' });
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setPwdStatus({ type: 'error', msg: data.error || 'Error al actualizar.' });
            }
        } catch (err) {
            setPwdStatus({ type: 'error', msg: 'Error de conexión.' });
        }
    };

    const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
        setPwdVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    }

    // New imports for Chevron
    const ChevronDown = ({ className }: {className?: string}) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
    )

    return (
        <div className="space-y-4">
             {/* Email Section */}
             <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
                <button 
                    onClick={() => toggleAccordion('email')}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-2 font-bold text-white">
                        <Mail size={18} className="text-ls-accent" /> Correo Electrónico
                    </div>
                    <ChevronDown className={`transform transition-transform duration-300 ${expanded === 'email' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                    {expanded === 'email' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 pt-0 border-t border-white/5">
                                {!requestPasswordMode ? (
                                    <form onSubmit={handleEmailSaveClick} className="space-y-4 mt-4">
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
                                    </form>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 bg-ls-accent/5 p-4 rounded-lg border border-ls-accent/20"
                                    >
                                        <p className="text-sm text-white mb-3">Para confirmar, ingresa tu contraseña actual:</p>
                                        <div className="space-y-3">
                                            <input 
                                                type="password" 
                                                placeholder="Contraseña actual"
                                                className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:border-ls-accent outline-none text-sm"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => setRequestPasswordMode(false)}>Cancelar</Button>
                                                <Button size="sm" onClick={handleConfirmEmailChange} disabled={!confirmPassword}>Confirmar</Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {emailStatus.msg && (
                                    <div className={`mt-3 p-2 rounded text-xs flex items-center gap-2 ${emailStatus.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                        {emailStatus.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                                        {emailStatus.msg}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>

             {/* Password Section */}
             <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
                <button 
                    onClick={() => toggleAccordion('security')}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-2 font-bold text-white">
                        <Settings size={18} className="text-ls-accent" /> Seguridad
                    </div>
                    <ChevronDown className={`transform transition-transform duration-300 ${expanded === 'security' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {expanded === 'security' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 pt-0 border-t border-white/5 mt-4">
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>

             {/* Site Info Section */}
             <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
                <button 
                    onClick={() => toggleAccordion('site')}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-2 font-bold text-white">
                        <Globe size={18} className="text-ls-accent" /> Información Pública (Landing)
                    </div>
                    <ChevronDown className={`transform transition-transform duration-300 ${expanded === 'site' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {expanded === 'site' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 pt-0 border-t border-white/5 mt-4">
                                <form onSubmit={handleSaveSiteConfig} className="space-y-4">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                                                    <Smartphone size={12}/> WhatsApp (Número)
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer scale-75">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={siteConfig.showWhatsapp}
                                                        onChange={(e) => setSiteConfig({...siteConfig, showWhatsapp: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ls-accent"></div>
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none text-sm placeholder:text-white/20"
                                                placeholder="+54 9 11 ..."
                                                value={siteConfig.whatsapp}
                                                onChange={(e) => setSiteConfig({...siteConfig, whatsapp: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                                                    <Instagram size={12}/> Instagram (Link)
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer scale-75">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={siteConfig.showInstagram}
                                                        onChange={(e) => setSiteConfig({...siteConfig, showInstagram: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ls-accent"></div>
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none text-sm placeholder:text-white/20"
                                                placeholder="https://instagram.com/..."
                                                value={siteConfig.instagram}
                                                onChange={(e) => setSiteConfig({...siteConfig, instagram: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                                                    <Music size={12}/> TikTok (Link)
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer scale-75">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={siteConfig.showTiktok}
                                                        onChange={(e) => setSiteConfig({...siteConfig, showTiktok: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ls-accent"></div>
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none text-sm placeholder:text-white/20"
                                                placeholder="https://tiktok.com/..."
                                                value={siteConfig.tiktok}
                                                onChange={(e) => setSiteConfig({...siteConfig, tiktok: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                                                    <Facebook size={12}/> Facebook (Link)
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer scale-75">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={siteConfig.showFacebook}
                                                        onChange={(e) => setSiteConfig({...siteConfig, showFacebook: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ls-accent"></div>
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none text-sm placeholder:text-white/20"
                                                placeholder="https://facebook.com/..."
                                                value={siteConfig.facebook}
                                                onChange={(e) => setSiteConfig({...siteConfig, facebook: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                                                    <Mail size={12}/> Email Público
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer scale-75">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={siteConfig.showEmail}
                                                        onChange={(e) => setSiteConfig({...siteConfig, showEmail: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ls-accent"></div>
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none text-sm placeholder:text-white/20"
                                                placeholder="contacto@motosls.com"
                                                value={siteConfig.email}
                                                onChange={(e) => setSiteConfig({...siteConfig, email: e.target.value})}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                                                    <MapPin size={12}/> Dirección
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer scale-75">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={siteConfig.showAddress}
                                                        onChange={(e) => setSiteConfig({...siteConfig, showAddress: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ls-accent"></div>
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none text-sm placeholder:text-white/20"
                                                placeholder="Av. Rivadavia 1234..."
                                                value={siteConfig.address}
                                                onChange={(e) => setSiteConfig({...siteConfig, address: e.target.value})}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                                                    <MapPin size={12}/> Link Google Maps
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer scale-75">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={siteConfig.showMapsLink}
                                                        onChange={(e) => setSiteConfig({...siteConfig, showMapsLink: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ls-accent"></div>
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none text-sm placeholder:text-white/20"
                                                placeholder="https://goo.gl/maps/..."
                                                value={siteConfig.mapsLink}
                                                onChange={(e) => setSiteConfig({...siteConfig, mapsLink: e.target.value})}
                                            />
                                            <p className="text-[10px] text-white/30 mt-1">Pega el link de compartir de Google Maps.</p>
                                        </div>
                                    </div>

                                    {/* Status Message */}
                                    {siteStatus.msg && (
                                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${siteStatus.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                            {siteStatus.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                                            {siteStatus.msg}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" variant="primary" size="sm">Guardar Información</Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
        </div>


  );
}
