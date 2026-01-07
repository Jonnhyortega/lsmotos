"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { logos } from "@/constants/logos";
import Image from "next/image";
import { ThreeBackground } from "@/components/landing/ThreeBackground";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] text-white font-sans selection:bg-ls-accent selection:text-ls-dark">
      {/* 3D Background */}
      <ThreeBackground />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md p-4 flex flex-col items-center justify-center">
        <div className="bg-black/10 backdrop-blur-md h-full w-full mt-4 flex flex-col items-center text-center">
            
            {/* Logo */}
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <Image 
                    src={logos.whiteLogo} 
                    alt="Motos LS" 
                    width={180} 
                    height={100} 
                    className="w-auto h-auto"
                    priority
                />
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl font-raleway font-bold uppercase mb-3 tracking-wider text-white">
                Portal de Acceso
            </h1>
            <p className="text-gray-400 mb-10 leading-relaxed text-sm">
                Seleccioná una opción para continuar.
            </p>

            {/* Actions */}
            <div className="space-y-4 w-full">
                <Link href="/distributor" className="block w-full">
                    <Button 
                        size="lg" 
                        className="w-full uppercase tracking-widest group flex items-center justify-center gap-2"
                    >
                        Ir al Sitio Web
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>

                <Link href="/admin" className="block w-full">
                    <Button 
                        size="lg" 
                        variant="outline"
                        className="w-full uppercase tracking-widest flex items-center justify-center gap-2 border-white/20 hover:bg-white/5 hover:text-white"
                    >
                        <ShieldCheck size={18} />
                        Panel Administrativo
                    </Button>
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 w-full">
                <p className="text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} Motos LS. Todos los derechos reservados.
                </p>
            </div>
        </div>
      </div>
    </main>
  );
}
