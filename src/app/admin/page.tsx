
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
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
  Music,
  Briefcase,
  HelpCircle,
  ChevronDown,
  MoreVertical,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Overlay } from '@/components/ui/Overlay';
import { logos } from '@/constants/logos';
import { BrandLoader } from '@/components/ui/BrandLoader';
import { ConfirmDialog, DialogVariant } from '@/components/ui/ConfirmDialog';
import { ToastContainer, Toast, ToastType } from '@/components/ui/Toast';
import ProductManager from '@/components/admin/ProductManager';
import BrandManager from '@/components/admin/BrandManager';
import { HelpCenter } from '@/components/admin/HelpCenter';

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  type: 'Distributor' | 'Newsletter';
  date: string;
  phone?: string;
  company?: string;
  message?: string;
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
  
  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
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

  const closeDialog = () => {
    setDialogConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <Dashboard 
        onLogout={handleLogout} 
        showDialog={showDialog} 
        closeDialog={closeDialog}
        showToast={addToast}
      />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
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
    closeDialog: () => void;
    showToast: (message: string, type: ToastType) => void;
}

interface EmailLog {
  _id?: string;
  id?: string;
  subject: string;
  message: string;
  recipientsCount?: number; // Updated to match usage in render
  recipients?: string | number; // Handling flexible type or legacy
  filterType?: string;
  status: string;
  sentAt?: string; // Matching render usage
  date?: string;   // Legacy
}

function Dashboard({ onLogout, showDialog, closeDialog, showToast }: DashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Distributor' | 'Newsletter'>('All');
  
  // View Mode
  // View Mappings
  const tabs = [
    { id: 'subscribers', label: 'Suscriptores', icon: User },
    { id: 'logs', label: 'Historial', icon: Mail },
    { id: 'catalogo', label: 'Catálogo', icon: CheckSquare },
    { id: 'brands', label: 'Marcas', icon: Briefcase }
  ];

  const [viewMode, setViewMode] = useState<string>('subscribers');
  const [navOpen, setNavOpen] = useState(false);
  const [direction, setDirection] = useState(0);

  const getTabIndex = (id: string) => tabs.findIndex(t => t.id === id);

  const handleNavClick = (id: string) => {
    if (isDraggingRef.current) return;
    const newDirection = getTabIndex(id) > getTabIndex(viewMode) ? 1 : -1;
    setDirection(newDirection);
    setViewMode(id);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null); // For viewing details

  const [showMailModal, setShowMailModal] = useState(false);
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);
  
  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Drag Nav State
  const navRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsDown(true);
    isDraggingRef.current = false;
    setStartX(e.pageX - navRef.current.offsetLeft);
    setScrollLeft(navRef.current.scrollLeft);
  };
  
  const handleMouseLeave = () => {
    setIsDown(false);
    isDraggingRef.current = false;
  };
  
  const handleMouseUp = () => {
    setIsDown(false);
    setTimeout(() => { isDraggingRef.current = false; }, 50); 
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    if (Math.abs(walk) > 5) {
        isDraggingRef.current = true;
    }
    navRef.current.scrollLeft = scrollLeft - walk;
  };



  // Fetch Logs
  useEffect(() => {
      if (viewMode === 'logs') {
          setLoadingLogs(true);
          fetch('/api/admin/emails-log')
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error(err))
            .finally(() => setLoadingLogs(false));
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
                    
                    closeDialog();
                    showToast('Suscriptor(es) eliminado(s) correctamente.', 'success');
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

  // Help Modal State
  const [showHelpModal, setShowHelpModal] = useState(false);

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
            <Button variant="ghost" size="sm" onClick={() => setShowHelpModal(true)} title="Centro de Ayuda" className="hover:bg-ls-accent hover:text-ls-dark transition-colors rounded-full w-10 h-10 p-0 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
            </Button>

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
      {/* CONTROLS */}
      {/* 1. Navigation (Full Width) */}
      <div className="mb-6 md:mb-8">
         <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1 mb-2">Secciones del Panel</h2>
         
         <div className="relative z-50 w-full md:w-[320px]">
            {/* SELECT TRIGGER */}
            <button 
                onClick={() => setNavOpen(!navOpen)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-300 group ${
                   navOpen 
                   ? 'bg-ls-dark border-ls-accent shadow-[0_0_20px_rgba(0,255,255,0.15)]' 
                   : 'bg-[#1A1A1A] border-white/10 hover:border-ls-accent/50'
                }`}
            >
                <div className="flex items-center gap-3">
                    {(() => {
                        const active = tabs.find(t => t.id === viewMode) || tabs[0];
                        const Icon = active.icon;
                        return (
                            <>
                                <div className={`p-2 rounded-lg ${navOpen ? 'bg-ls-accent/20 text-ls-accent' : 'bg-white/5 text-white/60 group-hover:text-ls-accent group-hover:bg-ls-accent/10'} transition-colors`}>
                                    <Icon size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-xs text-white/40 font-bold uppercase tracking-wider mb-0.5">Sección Actual</span>
                                    <span className="block text-white font-bold text-lg leading-none">{active.label}</span>
                                </div>
                            </>
                        );
                    })()}
                </div>
                <div className={`p-2 rounded-full border border-white/5 bg-black/20 text-white/50 transition-transform duration-300 ${navOpen ? 'rotate-180 text-ls-accent border-ls-accent/30' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            {/* BACKDROP */}
            {navOpen && (
                <div className="fixed inset-0 z-[-1]" onClick={() => setNavOpen(false)}></div>
            )}

            {/* DROPDOWN OPTIONS */}
            <AnimatePresence>
                {navOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#151515] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl ring-1 ring-white/5"
                    >
                        <div className="p-2 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        handleNavClick(tab.id);
                                        setNavOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                                        viewMode === tab.id
                                        ? 'bg-ls-accent text-ls-dark font-bold shadow-lg shadow-ls-accent/20'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <tab.icon size={18} className={viewMode === tab.id ? 'animate-pulse' : 'opacity-50 group-hover:opacity-100'} />
                                    <span>{tab.label}</span>
                                    {viewMode === tab.id && <Check size={16} className="ml-auto" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>
      </div>

      {/* 2. Filters & Actions Row (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8 items-end">
        {/* Search & Filter */}
        <div className="lg:col-span-8 flex flex-col gap-4">
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
        <div className="lg:col-span-4 flex justify-end gap-3 md:h-12 items-center">
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


      <div className="grid grid-cols-1 overflow-x-hidden min-h-[500px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={viewMode}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                const currIdx = getTabIndex(viewMode);
                if (currIdx < tabs.length - 1) {
                    setDirection(1);
                    setViewMode(tabs[currIdx + 1].id);
                }
              } else if (swipe > swipeConfidenceThreshold) {
                const currIdx = getTabIndex(viewMode);
                if (currIdx > 0) {
                    setDirection(-1);
                    setViewMode(tabs[currIdx - 1].id);
                }
              }
            }}
            className="w-full col-start-1 row-start-1"
          >
            {viewMode === 'catalogo' ? (
                <ProductManager />
            ) : viewMode === 'brands' ? (
                <BrandManager />
            ) : viewMode === 'subscribers' ? (
                /* Subscribers View Logic - extracted inline to save space/complexity for now but essentially same as before */
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
                            filteredCustomers.map(customer => (
                                <motion.div 
                                    key={customer.id} 
                                    className={`bg-[#1A1A1A] border rounded-xl overflow-hidden ${
                                        selectedIds.includes(customer.id) 
                                        ? 'border-ls-accent shadow-[0_0_15px_rgba(0,255,255,0.1)]' 
                                        : 'border-white/5'
                                    }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="p-4" onClick={() => toggleSelect(customer.id)}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex gap-3">
                                                <div 
                                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                                        selectedIds.includes(customer.id) ? 'bg-ls-accent border-ls-accent text-ls-dark' : 'border-white/20'
                                                    }`}
                                                >
                                                    {selectedIds.includes(customer.id) && <Check size={12} strokeWidth={4} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-lg leading-none mb-1">{customer.name}</h3>
                                                    <span className="text-white/40 text-xs">{customer.email}</span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                                                customer.type === 'Distributor' 
                                                ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' 
                                                : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                            }`}>
                                                {customer.type === 'Distributor' ? 'Distribuidor' : 'Newsletter'}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-xs text-white/60 pt-3 border-t border-white/5">
                                            <div>
                                                <span className="block text-white/20 uppercase text-[10px] font-bold">Fecha</span>
                                                {new Date(customer.date).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <span className="block text-white/20 uppercase text-[10px] font-bold">Estado</span>
                                                <span className="text-ls-accent">Activo</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-white/30">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No se encontraron resultados</p>
                            </div>
                        )}
                    </div>

                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                                    <th className="p-4 w-12">
                                        <button onClick={toggleSelectAll} className="hover:text-white transition-colors">
                                            {selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </button>
                                    </th>
                                    <th className="p-4 font-bold">Usuario</th>
                                    <th className="p-4 font-bold">Tipo</th>
                                    <th className="p-4 font-bold">Estado</th>
                                    <th className="p-4 font-bold">Fecha</th>
                                    <th className="p-4 font-bold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                    <tr 
                                        key={customer.id} 
                                        className={`group transition-all duration-200 ${
                                            selectedIds.includes(customer.id) ? 'bg-ls-accent/5' : 'hover:bg-white/5'
                                        }`}
                                        onClick={() => toggleSelect(customer.id)}
                                    >
                                        <td className="p-4">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                                selectedIds.includes(customer.id) ? 'bg-ls-accent border-ls-accent text-ls-dark' : 'border-white/20 group-hover:border-white/50'
                                            }`}>
                                                {selectedIds.includes(customer.id) && <Check size={10} strokeWidth={4} />}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-ls-accent font-bold text-xs ring-1 ring-white/10">
                                                    {customer.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-ls-accent transition-colors">{customer.name}</div>
                                                    <div className="text-xs text-white/40">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                                customer.type === 'Distributor' 
                                                ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' 
                                                : 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                                            }`}>
                                                {customer.type === 'Distributor' ? 'Distribuidor' : 'Newsletter'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-green-500 text-xs font-bold">Activo</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white/60 text-sm font-mono">
                                            {new Date(customer.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-white/30">
                                            No se encontraron resultados para tu búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </>
            ) : (
                /* LOGS VIEW */
                <div className="bg-[#1A1A1A] p-2 md:p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-xl font-bold font-imax text-white mb-4 pl-2">Historial de Correos Enviados</h3>
                    <div className="space-y-3">
                        {loadingLogs ? (
                            <p className="text-white/40 text-center py-10">Cargando historial...</p>
                        ) : logs.length > 0 ? (
                            logs.map((log, index) => (
                                <div 
                                    key={log._id || log.id || index} 
                                    className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-ls-accent/30 transition-all group cursor-pointer"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white group-hover:text-ls-accent transition-colors">{log.subject}</h4>
                                        <span className="text-xs text-white/40 font-mono">
                                            {new Date(log.sentAt || log.date || Date.now()).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-white/60 text-sm line-clamp-2 mb-3">{log.message}</p>
                                    <div className="flex items-center gap-4 text-xs font-mono text-white/30 border-t border-white/5 pt-3">
                                        <span className="flex items-center gap-1">
                                            <User size={12} /> {log.recipientsCount || log.recipients || 0} Destinatarios
                                        </span>
                                        {log.filterType && (
                                            <span className="flex items-center gap-1">
                                                <Filter size={12} /> {log.filterType}
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded ${log.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} ml-auto`}>
                                            {log.status === 'success' ? 'Enviado' : 'Fallido'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/40 text-center py-10">No hay registros de correos enviados.</p>
                        )}
                    </div>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

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
                         <p className="text-white">{selectedLog.recipientsCount || selectedLog.recipients || 0}</p>
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase">Fecha</h4>
                         <p className="text-white">{new Date(selectedLog.sentAt || selectedLog.date || Date.now()).toLocaleString()}</p>
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

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <Overlay isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="Detalle del Suscriptor">
             <div className="space-y-6">
                 <div className="flex items-start gap-4 pb-6 border-b border-white/10">
                    <div className="w-16 h-16 rounded-full bg-ls-accent/10 flex items-center justify-center text-ls-accent text-2xl font-bold">
                        {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{selectedCustomer.name}</h3>
                        <p className="text-ls-accent">{selectedCustomer.type === 'Distributor' ? 'Distribuidor' : 'Newsletter'}</p>
                        <p className="text-white/40 text-sm mt-1">Registrado el {new Date(selectedCustomer.date).toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase flex items-center gap-2"><Mail size={14}/> Email</h4>
                         <p className="text-white select-all">{selectedCustomer.email}</p>
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase flex items-center gap-2"><Smartphone size={14}/> Teléfono</h4>
                         <p className="text-white select-all">{selectedCustomer.phone || '-'}</p>
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase flex items-center gap-2"><MapPin size={14}/> Ciudad / Provincia</h4>
                         <p className="text-white">{selectedCustomer.city || '-'}</p>
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-white/40 mb-1 uppercase flex items-center gap-2"><Briefcase size={14}/> Empresa / Taller</h4>
                         <p className="text-white">{selectedCustomer.company || '-'}</p>
                     </div>
                 </div>

                 <div>
                     <h4 className="text-xs font-bold text-white/40 mb-2 uppercase flex items-center gap-2"><MessageSquare size={14}/> Mensaje / Consulta</h4>
                     <div className="bg-black/20 border border-white/10 rounded-lg p-4 text-white/80 font-mono text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                         {selectedCustomer.message || 'Sin mensaje adjunto.'}
                     </div>
                 </div>

                 <div className="flex justify-end pt-2">
                     <Button variant="ghost" onClick={() => setSelectedCustomer(null)}>Cerrar</Button>
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
      {/* Help Center Modal */}
      <HelpCenter isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
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
