'use client';

import { useState, useEffect } from 'react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '@/actions/productActions';
import { getBrands } from '@/actions/brandActions';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Image as ImageIcon, Loader2, Pencil, X, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { ConfirmDialog, DialogVariant } from '@/components/ui/ConfirmDialog';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Expanded Groups State
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    brandId: '',
    model: '',
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
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, brandsData] = await Promise.all([
          getProducts(),
          getBrands()
      ]);
      setProducts(productsData);
      setBrands(brandsData);
      
      // Initialize all brands as expanded
      const initialExpanded: Record<string, boolean> = {};
      // Group unique brand names to keys
      const uniqueBrands = Array.from(new Set(productsData.map((p: any) => p.brand?.name || 'Otras')));
      uniqueBrands.forEach((b: any) => initialExpanded[b] = true);
      initialExpanded['Otras'] = true; 
      setExpandedBrands(initialExpanded);

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

  const resetForm = () => {
    setFormData({ brandId: '', model: '', priority: 0 });
    setFile(null);
    setPreview(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (product: any) => {
      setFormData({
          brandId: product.brand?._id || '',
          model: product.modelName,
          priority: product.priority
      });
      setPreview(product.imageUrl);
      setFile(null); // Reset file input, if they want to keep the image they don't select a new one
      setIsEditing(true);
      setEditingId(product._id);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandId || !formData.model) return;
    if (!isEditing && !file) {
         showDialog({ title: 'Error', description: 'Debes subir una imagen para crear.', variant: 'error' });
         return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('brandId', formData.brandId);
      data.append('model', formData.model);
      data.append('priority', formData.priority.toString());
      if (file) {
        data.append('image', file);
      }

      let res;
      if (isEditing && editingId) {
          data.append('id', editingId);
          res = await updateProduct(data);
      } else {
          res = await createProduct(data);
      }

      if (res.success) {
        resetForm();
        // Reload products only
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
        
        showDialog({
            title: 'Éxito',
            description: isEditing ? 'Moto actualizada correctamente.' : 'Moto cargada correctamente.',
            variant: 'success'
        });
      } else {
        showDialog({
            title: 'Error',
            description: res.error || 'Error en la operación.',
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
        description: '¿Estás seguro de eliminar este producto?',
        variant: 'error',
        onConfirm: async () => {
            try {
                const res = await deleteProduct(id);
                if(res.success) {
                    setProducts(prev => prev.filter(p => p._id !== id));
                    setDialogConfig(prev => ({ ...prev, isOpen: false }));
                    if (editingId === id) resetForm(); // If deleting current editing item
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

  const toggleBrand = (brandName: string) => {
      setExpandedBrands(prev => ({
          ...prev,
          [brandName]: !prev[brandName]
      }));
  };

  // Grouping Logic
  const groupedProducts = products.reduce((groups, product) => {
      const brandName = product.brand?.name || 'Marca Eliminada';
      if (!groups[brandName]) {
          groups[brandName] = {
              priority: product.brand?.priority || 0,
              products: []
          };
      }
      groups[brandName].products.push(product);
      return groups;
  }, {} as Record<string, { priority: number, products: any[] }>);

  // Sorted Brands (by Priority DESC)
  const sortedBrandKeys = Object.keys(groupedProducts).sort((a, b) => {
      if (a === 'Marca Eliminada') return 1;
      if (b === 'Marca Eliminada') return -1;
      return groupedProducts[b].priority - groupedProducts[a].priority;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Formulario */}
      <div className={`border rounded-xl p-6 transition-colors ${isEditing ? 'bg-ls-accent/5 border-ls-accent' : 'bg-white/5 border-white/10'}`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ls-accent font-imax uppercase flex items-center gap-2">
                {isEditing ? <><Pencil className="w-5 h-5" /> Editar Moto</> : <><Plus className="w-5 h-5" /> Agregar Nueva Moto</>}
            </h2>
            {isEditing && (
                <button onClick={resetForm} className="text-xs flex items-center gap-1 text-gray-400 hover:text-white px-3 py-1 rounded-full bg-white/10 transition-colors">
                    <X className="w-3 h-3" /> Cancelar Edición
                </button>
            )}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div>
                <label className="block text-sm text-gray-400 mb-1">Marca</label>
                <select 
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-ls-accent outline-none"
                    value={formData.brandId}
                    onChange={e => setFormData({...formData, brandId: e.target.value})}
                    required
                >
                    <option value="" disabled className="text-gray-500">Seleccionar Marca</option>
                    {brands.length > 0 ? (
                        brands.map((brand) => (
                            <option key={brand._id} value={brand._id} className="text-black">{brand.name}</option>
                        ))
                    ) : (
                        <option value="" disabled>No hay marcas creadas</option>
                    )}
                </select>
                {brands.length === 0 && <p className="text-xs text-red-400 mt-1">Primero crea una marca en la pestaña "Gestión de Marcas".</p>}
             </div>
             <div>
                <label className="block text-sm text-gray-400 mb-1">Modelo</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-ls-accent outline-none placeholder:text-gray-600"
                  placeholder="Ej: XR 150"
                  value={formData.model}
                  onChange={e => setFormData({...formData, model: e.target.value})}
                  required
                />
             </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Prioridad (Orden del Modelo)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-ls-accent outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: Number(e.target.value)})}
                />
                <p className="text-xs text-gray-500 mt-1">Mayor número = Aparece antes dentro de su marca.</p>
             </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm text-gray-400 mb-1">Imagen {isEditing && '(Dejar vacío para mantener actual)'}</label>
            <div className={`relative border-2 border-dashed border-white/10 rounded-xl h-48 flex flex-col items-center justify-center p-4 transition-colors ${preview ? 'bg-black/40' : 'hover:bg-white/5'}`}>
               {!preview ? (
                   <>
                     <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />
                     <p className="text-gray-400 text-sm mb-2">Click para subir foto</p>
                     <input type="file" accept="image/*" onChange={handleFileChange} className="absolute opacity-0 inset-0 cursor-pointer w-full h-full" />
                   </>
               ) : (
                   <div className="relative w-full h-full">
                       <Image src={preview} alt="Preview" fill className="object-contain" />
                       <button type="button" onClick={() => {setFile(null); setPreview(null)}} className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600 z-10 transition-colors">
                           <Trash2 size={16} />
                       </button>
                   </div>
               )}
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
              {isSubmitting ? 
                  <><Loader2 className="animate-spin mr-2" /> {isEditing ? 'Actualizando...' : 'Subiendo...'}</> 
                  : <><Plus className="mr-2" /> {isEditing ? 'Guardar Cambios' : 'Agregar al Catálogo'}</>
              }
            </Button>
          </div>
        </form>
      </div>

      {/* Lista Agrupada por Marca */}
      <h2 className="text-xl font-bold text-white mb-4 font-imax uppercase">Catálogo Actual</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-ls-accent w-10 h-10" /></div>
      ) : (
        <div className="space-y-6">
            {products.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white/5 rounded-lg border border-white/5">No hay motos cargadas.</div>
            ) : (
                sortedBrandKeys.map(brandName => {
                    const isExpanded = expandedBrands[brandName] ?? true; 
                    const brandProducts = groupedProducts[brandName].products;

                    return (
                        <div key={brandName} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                            {/* Header Replegable */}
                            <button 
                                onClick={() => toggleBrand(brandName)}
                                className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">{brandName}</h3>
                                    <span className="text-xs bg-ls-accent/20 text-ls-accent px-2 py-0.5 rounded-full font-bold">{brandProducts.length}</span>
                                </div>
                                {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                            </button>
                            
                            {/* Grid de Productos */}
                            {isExpanded && (
                                <div className="p-6 border-t border-white/10 bg-black/20">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {brandProducts.map((product: any) => (
                                            <div key={product._id} className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-ls-accent/50 transition-all flex flex-col hover:-translate-y-1">
                                                {/* Edit Overlay Button */}
                                                <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 bg-ls-accent text-black rounded-full hover:bg-white hover:text-black transition-colors shadow-lg"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                </div>

                                                <div className="relative h-48 w-full bg-black/40 p-2">
                                                    <Image src={product.imageUrl} alt={product.modelName} fill className="object-cover" />
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg leading-tight">{product.modelName}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                                                        <span className="text-xs text-gray-500">P: {product.priority}</span>
                                                        <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-white/10 rounded-full" title="Eliminar">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
      )}

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
