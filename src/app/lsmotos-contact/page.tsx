'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button'; // Assuming we have this reusable component

export default function LsContactThankYou() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00CEFE]/20 via-[#050505] to-[#000000] py-20 px-4">
      
      {/* Background Content Removed (3D Scene) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Optional: Add some subtle noise or texture if needed, otherwise clean gradient */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 p-6 md:p-8 max-w-md w-full"
      >
        {/* Glass Effect Container Removed */}
        {/* <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl" /> */}
        
        
        <div className="relative z-20 flex flex-col items-center text-center space-y-5">
          
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-ls-accent/10 border border-ls-accent flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(0,206,254,0.3)]"
          >
             <CheckCircle2 className="w-8 h-8 text-ls-accent" />
          </motion.div>

          {/* Text Content */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest font-imax">
              ¡GRACIAS!
            </h1>
            <h2 className="text-lg md:text-xl text-ls-accent font-light tracking-wide uppercase">
              Tu solicitud fue enviada
            </h2>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed pt-2 text-sm md:text-base">
              Hemos recibido tu información correctamente. Nuestro equipo comercial se pondrá en contacto contigo a la brevedad para avanzar con tu alta como distribuidor.
            </p>
          </div>

          {/* Social / Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4">
            <Link href="https://www.instagram.com/lsmotos" target="_blank" className="w-full sm:w-auto">
              <Button 
                variant="primary" 
                size="md" 
                className="w-full gap-2 hover:shadow-[0_0_20px_rgba(0,206,254,0.4)] transition-all duration-300"
              >
                <Instagram size={18} />
                Seguinos en Instagram
              </Button>
            </Link>
            
            <Link href="/" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="md" 
                className="w-full gap-2 border-white/20 hover:bg-white/5 hover:border-white/40"
              >
                <ArrowLeft size={18} />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-white/20 text-[10px] mt-4">
            LS Motos &copy; {new Date().getFullYear()} — Potencia y Calidad
          </p>
        </div>
      </motion.div>
    </div>
  );
}
