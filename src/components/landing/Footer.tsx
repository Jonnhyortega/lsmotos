
"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { logos } from "@/constants/logos";

export const Footer = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    
    // Dynamic Config State
    const [config, setConfig] = useState({
      whatsapp: '',
      instagram: '',
      facebook: '',
      email: '',
      address: '',
      mapsLink: '',
      showWhatsapp: true,
      showInstagram: true,
      showFacebook: true,
      showEmail: true,
      showAddress: true,
      showMapsLink: true
    });
  
    // Fetch configuration
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Since this component is client-side, we fetch from our local API
                // Note: In a real high-traffic app we might statically generate this, 
                // but for this dashboard usage, client-side fetch is fine.
                const res = await fetch('/api/admin/config');
                if (res.ok) {
                    const data = await res.json();
                    if (data) setConfig((prev) => ({ ...prev, ...data }));
                }
            } catch (e) {
               console.error("Error loading site config", e);
            }
        };
        fetchConfig();
    }, []);
  
    const handleSubscribe = async () => {
      if (!email || !name) return;
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
          return;
      }
  
      setStatus("loading");
  
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
            type: 'Newsletter'
          })
        });
  
        if (res.ok) {
          setStatus("success");
          setEmail("");
          setName("");
          setTimeout(() => setStatus("idle"), 3000);
        } else {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    };
  
    return (
      <footer className="bg-[#050505] text-white border-t border-white/10 pt-16 pb-8 font-sans">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block mb-6">
                  <Image src={logos.whiteLogo} alt="Logo" width={200} height={200} className="m-auto" />
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                Potenciamos tu negocio con la red de distribución más sólida del país. Calidad, respaldo y rentabilidad para tu taller o concesionaria.
              </p>
              <div className="flex gap-4">
                {config.showInstagram && config.instagram && <SocialLink href={config.instagram} icon={<Instagram size={20} />} />}
                {config.showFacebook && config.facebook && <SocialLink href={config.facebook} icon={<Facebook size={20} />} />}
              </div>
            </div>
  
            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="font-imax font-bold text-lg mb-6 text-ls-accent uppercase">Navegación</h4>
              <ul className="space-y-4">
                <FooterLink href="#hero">Inicio</FooterLink>
                <FooterLink href="#benefits">Beneficios</FooterLink>
                <FooterLink href="#catalog">Catálogo</FooterLink>
                <FooterLink href="#contact">Ser Distribuidor</FooterLink>
              </ul>
            </div>
  
            {/* Legal / Support */}
            <div className="lg:col-span-2">
              <h4 className="font-imax font-bold text-lg mb-6 text-ls-accent uppercase">Soporte</h4>
              <ul className="space-y-4">
                <FooterLink href="#">Preguntas Frecuentes</FooterLink>
                <FooterLink href="#">Términos y Condiciones</FooterLink>
                <FooterLink href="#">Política de Privacidad</FooterLink>
                <FooterLink href="#">Portal de Clientes</FooterLink>
              </ul>
            </div>
  
            {/* Contact Info */}
            <div className="lg:col-span-4">
              <h4 className="font-imax font-bold text-lg mb-6 text-ls-accent uppercase">Contacto</h4>
              
              <ul className="space-y-4">
                {config.showAddress && config.address && (
                  <li className="flex items-start gap-3 text-gray-400">
                    <MapPin className="text-ls-accent shrink-0 mt-1" size={18} />
                    {config.mapsLink && config.showMapsLink ? (
                        <a href={config.mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <span dangerouslySetInnerHTML={{ __html: config.address.replace(/\n/g, '<br/>') }} />
                        </a>
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: config.address.replace(/\n/g, '<br/>') }} />
                    )}
                  </li>
                )}
                
                {config.showWhatsapp && config.whatsapp && (
                  <li className="flex items-center gap-3 text-gray-400">
                    <Phone className="text-ls-accent shrink-0" size={18} />
                    <span>
                         <a href={`https://wa.me/${config.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                             {config.whatsapp}
                         </a>
                    </span>
                  </li>
                )}

                {config.showEmail && config.email && (
                  <li className="flex items-center gap-3 text-gray-400">
                    <Mail className="text-ls-accent shrink-0" size={18} />
                    <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">
                      {config.email || 'email@motosls.com'}
                    </a>
                  </li>
                )}
              </ul>
              
              {/* Mini Newsletter */}
              <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-gray-500 mb-3">Suscribite a novedades mayoristas</p>
                  <div className="space-y-2">
                    <input 
                        type="text" 
                        placeholder="Tu nombre"
                        className={`bg-[#111] border rounded-md px-4 py-2 w-full text-sm focus:outline-none transition-colors ${
                          status === "error" ? "border-red-500" : "border-white/10 focus:border-ls-accent"
                        }`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={status === "loading" || status === "success"}
                    />
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder={status === "success" ? "¡Suscrito!" : "Tu email..."}
                            className={`bg-[#111] border rounded-md px-4 py-2 w-full text-sm focus:outline-none transition-colors ${
                              status === "error" ? "border-red-500" : "border-white/10 focus:border-ls-accent"
                            }`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading" || status === "success"}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                        />
                        <button 
                          onClick={handleSubscribe}
                          disabled={status === "loading" || status === "success" || !email || !name}
                          className="bg-ls-accent text-ls-dark p-2 rounded-md hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {status === "loading" ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : status === "success" ? (
                              <Check size={18} />
                            ) : (
                              <ArrowRight size={18} />
                            )}
                        </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
  
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} <span className="font-imax text-ls-accent">Motos LS</span>. Todos los derechos reservados.</p>
            <div className="flex gap-6 items-center">
              <a href="#" className="hover:text-ls-accent transition-colors">Privacidad</a>
              <a href="#" className="hover:text-ls-accent transition-colors">Términos</a>
              <div className="w-px h-3 bg-white/20 hidden md:block"></div>
              <a href="https://www.astralvisionestudio.com/" target="_blank" rel="noopener noreferrer" className="hover:text-ls-accent transition-colors flex items-center gap-1 group">
                 <span className="opacity-50 text-xs">by</span> 
                 <span className="font-semibold group-hover:text-ls-accent">Astral Vision</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  // Helper Components
  const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-ls-accent hover:text-ls-dark transition-all duration-300 transform hover:scale-110"
    >
      {icon}
    </a>
  );

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link 
      href={href} 
      className="text-gray-400 hover:text-ls-accent transition-colors text-sm hover:translate-x-1 block duration-200"
    >
      {children}
    </Link>
  </li>
);
