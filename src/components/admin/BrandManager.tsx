'use client';

import { useState, useEffect } from 'react';
import { createBrand, deleteBrand, getBrands } from '@/actions/brandActions';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ConfirmDialog, DialogVariant } from '@/components/ui/ConfirmDialog';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function BrandManager() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    priority: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const showDialog = (config: { title: string; description: string; variant?: DialogVariant; onConfirm?: () => void }) => {
    setDialogConfig({
        isOpen: true,
        variant: 'info',
        ...config
    });
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.name) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('priority', formData.priority.toString());
      data.append('logo', file);

      const res = await createBrand(data);
      if (res.success) {
        setFormData({ name: '', priority: 0 });
        setFile(null);
        setPreview(null);
        loadBrands();
        showDialog({
            title: 'Éxito',
            description: 'Marca creada correctamente.',
            variant: 'success'
        });
      } else {
        showDialog({
            title: 'Error',
            description: res.error || 'Error al crear la marca.',
            variant: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      showDialog({
        title: 'Error',
        description: 'Error al subir.',
        variant: 'error'
    });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    showDialog({
        title: 'Confirmar Eliminación',
        description: '¿Estás seguro? Esto podría afectar a los productos asociados si no se han eliminado primero.',
        variant: 'error',
        onConfirm: async () => {
            try {
                const res = await deleteBrand(id);
                if(res.success) {
                    setBrands(prev => prev.filter(b => b._id !== id));
                    setDialogConfig(prev => ({ ...prev, isOpen: false }));
                } else {
                    showDialog({ title: 'Error', description: 'Error al eliminar', variant: 'error' });
                }
            } catch(error) {
                console.error(error);
                showDialog({ title: 'Error', description: 'Error de conexión', variant: 'error' });
            }
        }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Formulario */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-ls-accent mb-6 font-imax uppercase">Nueva Marca</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-ls-accent outline-none placeholder:text-gray-600"
                  placeholder="Ej: Honda, Bajaj, Motomel"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
             </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Prioridad (Orden en el catálogo)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-ls-accent outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: Number(e.target.value)})}
                />
                <p className="text-xs text-gray-500 mt-1">Más alto = Aparece más arriba en la página</p>
             </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm text-gray-400 mb-1">Logo</label>
            <div className={`relative border-2 border-dashed border-white/10 rounded-xl h-48 flex flex-col items-center justify-center p-4 transition-colors ${preview ? 'bg-black/40' : 'hover:bg-white/5'}`}>
               {!preview ? (
                   <>
                     <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />
                     <p className="text-gray-400 text-sm mb-2">Subir Logo</p>
                     <input type="file" accept="image/*" onChange={handleFileChange} className="absolute opacity-0 inset-0 cursor-pointer w-full h-full" />
                   </>
               ) : (
                   <div className="relative w-full h-full">
                       <Image src={preview} alt="Preview" fill className="object-contain" />
                       <button type="button" onClick={() => {setFile(null); setPreview(null)}} className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600 z-10">
                           <Trash2 size={16} />
                       </button>
                   </div>
               )}
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
              {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Guardando...</> : <><Plus className="mr-2" /> Crear Marca</>}
            </Button>
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
              <div key={brand._id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between group hover:border-ls-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-white/10 rounded-lg overflow-hidden p-1">
                          <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain" />
                      </div>
                      <div>
                          <h4 className="font-bold text-white text-lg">{brand.name}</h4>
                          <span className="text-xs text-gray-500">Prioridad: {brand.priority}</span>
                      </div>
                  </div>
                  <button onClick={() => handleDelete(brand._id)} className="p-2 text-white/30 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors">
                      <Trash2 size={18} />
                  </button>
              </div>
          ))}
          {brands.length === 0 && !isLoading && (
              <div className="text-gray-500 text-sm col-span-3 text-center py-10">No hay marcas registradas.</div>
          )}
      </div>

      <ConfirmDialog 
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
        title={dialogConfig.title}
        description={dialogConfig.description}
        variant={dialogConfig.variant}
        onConfirm={dialogConfig.onConfirm}
      />
    </div>
  );
}
