'use client'

import { useState, useEffect } from 'react';
import { getProducts } from '@/actions/productActions';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/landing/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { BrandLoader } from '@/components/ui/BrandLoader';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Brand {
    _id: string;
    name: string;
    logoUrl: string;
    priority: number;
}

interface Product {
    _id: string;
    brand: Brand;
    modelName: string;
    imageUrl: string;
    priority: number;
}

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filtered = products.filter(p => {
            const brandName = p.brand?.name?.toLowerCase() || '';
            const modelName = p.modelName?.toLowerCase() || '';
            return brandName.includes(lowerSearch) || modelName.includes(lowerSearch);
        });
        setFilteredProducts(filtered);
    }, [search, products]);

    // Group products by brand
    const groupedProducts = filteredProducts.reduce((groups, product) => {
        const brandName = product.brand?.name || 'Otras'; // Fallback
        if (!groups[brandName]) {
            groups[brandName] = {
                brand: product.brand,
                products: []
            };
        }
        groups[brandName].products.push(product);
        return groups;
    }, {} as Record<string, { brand: Brand, products: Product[] }>);

    // Sort brands by priority (High priority first)
    const sortedBrandKeys = Object.keys(groupedProducts).sort((a, b) => {
        const priorityA = groupedProducts[a].brand?.priority || 0;
        const priorityB = groupedProducts[b].brand?.priority || 0;
        return priorityB - priorityA; // Descending
    });

    return (
        <div className="min-h-screen bg-ls-dark text-white font-sans flex flex-col">
             {/* Navbar */}
             <nav className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-ls-dark/95 backdrop-blur z-50">
                 <div className="flex items-center gap-4">
                     <Link href="/" className="hover:text-ls-accent transition-colors flex items-center gap-2 group">
                         <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                         <span className="font-bold uppercase tracking-widest text-sm hidden sm:inline">Volver</span>
                     </Link>
                 </div>
                 <h1 className="text-xl md:text-2xl font-imax uppercase font-bold text-center absolute left-1/2 -translate-x-1/2 w-full pointer-events-none">
                    Catálogo <span className="text-ls-accent">LS</span>
                 </h1>
                 <div className="w-10"></div> {/* Spacer for balance */}
             </nav>

             <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
                {/* Search */}
                <div className="mb-16 relative max-w-xl mx-auto">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input 
                        type="text" 
                        placeholder="Buscar por marca o modelo..." 
                        className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border border-white/10 rounded-full focus:border-ls-accent focus:outline-none transition-all placeholder:text-white/30 text-lg shadow-2xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                     <div className="flex justify-center items-center h-64">
                         <BrandLoader />
                     </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center text-white/40 py-20 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xl">No se encontraron motos disponibles.</p>
                        <p className="text-sm mt-2">Intenta con otra búsqueda.</p>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {sortedBrandKeys.map(brandName => {
                            const { brand, products: brandProducts } = groupedProducts[brandName];
                            
                            // Sort products inside brand by its own priority
                            const sortedProducts = brandProducts.sort((a, b) => b.priority - a.priority);

                            return (
                                <section key={brandName} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                                    <div className="flex items-end gap-6 mb-10 border-b border-white/10 pb-4">
                                        {/* Logo if available */}
                                        {brand?.logoUrl && (
                                            <div className="relative w-24 h-16 md:w-32 md:h-20 bg-white/5 rounded-lg p-2 mb-[-8px]">
                                                <Image src={brand.logoUrl} alt={brandName} fill className="object-contain" />
                                            </div>
                                        )}
                                        <h2 className="text-4xl md:text-6xl font-imax uppercase font-bold text-white leading-none tracking-tight">
                                            {brandName}
                                        </h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {sortedProducts.map(product => (
                                            <div key={product._id} className="group bg-[#0F0F0F] border border-white/5 rounded-2xl overflow-hidden hover:border-ls-accent/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] hover:-translate-y-2 flex flex-col">
                                                <div className="relative h-64 w-full bg-linear-to-b from-white/5 to-transparent p-6 flex items-center justify-center overflow-hidden">
                                                    <Image 
                                                        src={product.imageUrl} 
                                                        alt={product.modelName} 
                                                        fill 
                                                        className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl" 
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col justify-between bg-[#151515]">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <p className="text-ls-accent text-xs font-bold uppercase tracking-widest opacity-80">{brandName}</p>
                                                            {/* <span className="text-[10px] text-white/20 border border-white/10 px-1 rounded">P:{product.priority}</span> */}
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight uppercase font-raleway">{product.modelName}</h3>
                                                    </div>
                                                    <button 
                                                        onClick={() => window.open(`https://wa.me/5492984707541?text=Hola,%20me%20interesa%20la%20moto%20${brandName}%20${product.modelName}`, '_blank')}
                                                        className="w-full mt-6 py-3 border border-white/10 rounded-lg text-sm bg-white/5 hover:bg-ls-accent hover:text-black hover:border-transparent transition-all font-bold uppercase tracking-wider"
                                                    >
                                                        Consultar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
             </main>

             <Footer />
             <WhatsAppButton />
        </div>
    );
}
