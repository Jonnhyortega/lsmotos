
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Mail, 
  LogOut, 
  User, 
  CheckSquare, 
  Square,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [password, setPassword] = useState('');
  
  // Login Simulator
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple mock password
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta (Test: admin123)');
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
              type="password" 
              placeholder="Contraseña" 
              className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ls-accent transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="button" onClick={handleLogin} className="w-full">
            INGRESAR
          </Button>
          <p className="text-xs text-center text-gray-500 mt-4">Contraseña demo: admin123</p>
        </form>
      </div>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Distributor' | 'Newsletter'>('All');
  const [showMailModal, setShowMailModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-ls-dark text-ls-light p-6 md:p-10 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-white mb-2" style={{ fontFamily: 'var(--font-imax)' }}>
            DASHBOARD <span className="text-ls-accent">LEADS</span>
          </h1>
          <p className="text-white/60">Gestión de Suscriptores y Distribuidores</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium">Admin Activo</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
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

      {/* MAIL MODAL (Simple Overlay) */}
      {showMailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-ls-accent" />
              Redactar Correo Masivo
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Enviando a <strong>{selectedIds.length}</strong> destinatarios seleccionados.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Asunto</label>
                <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none" placeholder="Novedades Motos LS..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Mensaje</label>
                <textarea rows={4} className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-ls-accent outline-none" placeholder="Escribe tu mensaje aquí..."></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setShowMailModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => { alert('Función de envío simulada!'); setShowMailModal(false); }}>
                Enviar Ahora
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
