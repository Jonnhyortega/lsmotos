"use client";

import Link from "next/link";
<<<<<<< Updated upstream
import { ArrowRight } from "lucide-react";
import { LANDING_CONTENT } from "@/constants/content";
=======
import { ArrowLeft, Briefcase, Building2, Check, ChevronDown, Crown, Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/landing/ContactForm";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
// import { LANDING_CONTENT } from "@/constants/content";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";
import Image from "next/image";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ThreeBackground } from "@/components/landing/ThreeBackground";
>>>>>>> Stashed changes

export default function LandingIndex() {
  const content = LANDING_CONTENT;

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-8 relative">
=======
    <div className="min-h-screen bg-black text-white selection:bg-ls-accent selection:text-black font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-100 p-2 md:p-4 flex justify-between items-center pointer-events-none">
        {/* Animated Background & Border */}
        <motion.div 
            className="absolute inset-0 bg-black/30 backdrop-blur-md border-b border-white/10"
            initial={false}
            animate={{ y: isScrolled ? "-100%" : "0%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        />
>>>>>>> Stashed changes

      <div className="max-w-4xl w-full text-center space-y-12">
        <h1 className="text-5xl md:text-7xl font-bold font-imax tracking-tighter uppercase mb-4">
          Motos LS <span className="text-ls-accent">{content.selection.title}</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {content.selection.subtitle}
        </p>

<<<<<<< Updated upstream
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/landing/option1" className="group relative block p-8 bg-[#1a1a1a] border border-white/10 hover:border-ls-accent transition-all hover:-translate-y-2 rounded-xl text-left overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-ls-accent" size={32} />
             </div>
             <div className="h-full flex flex-col justify-between">
                <div>
                   <span className="text-xs font-mono text-ls-accent mb-2 block tracking-widest">{content.selection.options[0].label}</span>
                   <h2 className="text-2xl font-bold font-imax mb-2">{content.selection.options[0].title}</h2>
                   <p className="text-sm text-gray-400">{content.selection.options[0].description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5">
                    <span className="text-xs uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors">{content.selection.options[0].cta} &rarr;</span>
                </div>
             </div>
          </Link>

          <Link href="/landing/option2" className="group relative block p-8 bg-[#F4F4F4] text-black border border-transparent hover:border-ls-accent transition-all hover:-translate-y-2 rounded-xl text-left overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-ls-dark" size={32} />
             </div>
             <div className="h-full flex flex-col justify-between">
                <div>
                   <span className="text-xs font-mono text-gray-500 mb-2 block tracking-widest">{content.selection.options[1].label}</span>
                   <h2 className="text-2xl font-bold font-imax mb-2 text-ls-dark">{content.selection.options[1].title}</h2>
                   <p className="text-sm text-gray-600">{content.selection.options[1].description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-black/10">
                   <span className="text-xs uppercase tracking-wider text-gray-500 group-hover:text-black transition-colors">{content.selection.options[1].cta} &rarr;</span>
                </div>
             </div>
          </Link>

          <Link href="/landing/option3" className="group relative block p-8 bg-[#232323] border border-white/10 hover:border-ls-accent transition-all hover:-translate-y-2 rounded-xl text-left overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity z-10">
                <ArrowRight className="text-ls-accent" size={32} />
             </div>
             <div className="h-full flex flex-col justify-between relative z-10">
                <div>
                   <span className="text-xs font-mono text-ls-accent mb-2 block tracking-widest">{content.selection.options[2].label}</span>
                   <h2 className="text-2xl font-bold font-imax mb-2">{content.selection.options[2].title}</h2>
                   <p className="text-sm text-gray-400">{content.selection.options[2].description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5">
                   <span className="text-xs uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors">{content.selection.options[2].cta} &rarr;</span>
                </div>
             </div>
          </Link>
        </div>
      </div>
=======
        {/* Desktop CTA - Always Visible */}
        <div className="hidden md:block z-101 pointer-events-auto">
             <Button variant="outline" size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})}>
                CONTACTAR
            </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
            className="md:hidden z-101 p-2 text-white hover:text-ls-accent transition-colors pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            animate={{ opacity: isScrolled ? 0 : 1 }} // Optionally hide on scroll too, or keep it? User said "navbar se esconda", implying the bar. 
            // Usually you want mobile menu access always. But let's stick to "hide navbar". 
            // If the user wants JUST the contact button, I should probably hide the hamburger too if strictly interpreting "navbar hides". 
            // However, removing navigation capability is risky. 
            // Let's assume hiding it forms part of the "clean view" request.
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-200 bg-zinc-950 flex flex-col items-center justify-center md:hidden pointer-events-auto"
                >
                    <button 
                         className="absolute top-6 right-6 text-white p-2 hover:text-ls-accent transition-colors"
                         onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={32} />
                    </button>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center gap-12"
                    >
                        <div className="text-4xl font-imax font-bold text-white tracking-tighter">
                            <Image src="/images/LOGO1.png" alt="Logo" width={200} height={200} />
                        </div>
                        
                        <button 
                            onClick={() => {
                                window.open('https://wa.me/5492231234567', '_blank');
                                setIsMobileMenuOpen(false);
                            }}
                             className="text-2xl font-bold uppercase rounded-md bg-ls-accent text-black px-12 py-4 hover:bg-white transition-colors tracking-widest"
                        >
                            CONTACTAR
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>



     {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
        <ThreeBackground />

        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10 text-center flex flex-col items-center justify-center h-full p-4 md:p-2"
        >
            <h1 className="text-xl md:text-4xl lg:text-5xl font-bold font-raleway tracking-tight uppercase leading-tight lg:mt-20 mb-6 max-w-5xl mx-auto text-balance">
                Convertite en distribuidor de <span className="font-imax font-bold text-ls-accent text-2xl md:text-5xl my-2 break-words inline-block">motos LS</span>  y sumá una nueva línea de ingresos para tu negocio.
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light font-raleway px-4">
                Stock estable, buenas condiciones comerciales, respaldo de marca y materiales listos para vender más en tu ciudad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="md" className="uppercase tracking-widest text-lg w-full sm:w-auto" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})}>
                    Quiero info mayorista
                </Button>
            </div>
        </motion.div>
      </section>

      {/* 2. Benefits Section (Directo) */}
      <section className="py-24 bg-linear-to-b from-[#0a0a0a] to-[#151515]">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                 <h2 className="text-2xl font-imax uppercase mb-4">Pensado para negocios que quieren vender más, sin complicarse la vida.</h2>
                 <p className="text-gray-400 max-w-2xl mx-auto">Si tenés una PyME, un local de repuestos, un taller, un negocio de motos o simplemente querés empezar a revender, <span className="font-imax text-ls-accent">motos LS</span> te permite sumar una línea de productos con:</p>
             </div>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
            >
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                    whileHover={{ backgroundColor: '#111', zIndex: 10 }}
                    className="bg-[#0f0f0f] border border-white/5 p-8 flex flex-col gap-4 group hover:border-ls-accent/50 transition-all duration-300"
                >
                    <div className="text-ls-accent/80 group-hover:text-ls-accent transition-colors w-fit"><Check size={32} strokeWidth={3} /></div>
                    <p className="text-white font-bold text-lg leading-snug">Modelos con alta rotación y demanda real.</p>
                </motion.div>
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                    whileHover={{ backgroundColor: '#111', zIndex: 10 }}
                    className="bg-[#0f0f0f] border border-white/5 p-8 flex flex-col gap-4 group hover:border-ls-accent/50 transition-all duration-300"
                >
                    <div className="text-ls-accent/80 group-hover:text-ls-accent transition-colors w-fit"><Check size={32} strokeWidth={3} /></div>
                    <p className="text-white font-bold text-lg leading-snug">Márgenes competitivos para que ganar plata tenga sentido.</p>
                </motion.div>
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                    whileHover={{ backgroundColor: '#111', zIndex: 10 }}
                    className="bg-[#0f0f0f] border border-white/5 p-8 flex flex-col gap-4 group hover:border-ls-accent/50 transition-all duration-300"
                >
                    <div className="text-ls-accent/80 group-hover:text-ls-accent transition-colors w-fit"><Check size={32} strokeWidth={3} /></div>
                    <p className="text-white font-bold text-lg leading-snug">Acompañamiento en pedidos y reposición.</p>
                </motion.div>
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                    whileHover={{ backgroundColor: '#111', zIndex: 10 }}
                    className="bg-[#0f0f0f] border border-white/5 p-8 flex flex-col gap-4 group hover:border-ls-accent/50 transition-all duration-300"
                >
                    <div className="text-ls-accent/80 group-hover:text-ls-accent transition-colors w-fit"><Check size={32} strokeWidth={3} /></div>
                    <p className="text-white font-bold text-lg leading-snug">Material digital listo para que promociones en redes y WhatsApp.</p>
                </motion.div>
            </motion.div>
            <div className="text-center mt-12">
                 <Button variant="outline" onClick={() => document.getElementById('conditions')?.scrollIntoView({ behavior: 'smooth'})}>
                     Quiero ver condiciones comerciales
                 </Button>
            </div>
         </div>
      </section>

      {/* 3. How It Works (Redesigned) */}
      <section className="py-24 bg-gray-50 text-ls-dark font-raleway">
          <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl md:text-5xl font-raleway font-bold uppercase mb-16 text-center text-ls-dark">
                  ¿Cómo es trabajar con <span className="font-imax text-ls-accent">motos LS</span>?
              </h2>
              <div className="space-y-12 relative">
                   {/* Vertical line connection */}
                   <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-200 md:left-1/2 md:-translate-x-1/2 z-0 hidden md:block" />
                   
                   {/* Step 1 */}
                   <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 md:text-right">
                       <div className="flex-1 text-center md:text-right">
                           <h3 className="text-2xl font-bold font-raleway text-ls-dark mb-3 uppercase tracking-wide">
                               Aplicás como distribuidor
                           </h3>
                           <p className="text-gray-600 text-lg leading-relaxed font-raleway">
                               Completás un formulario corto con datos de tu negocio y zona.
                           </p>
                       </div>
                       <div className="shrink-0 flex items-center justify-center">
                           <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-100 shadow-sm flex items-center justify-center relative z-10">
                               <span className="text-xl font-bold font-raleway text-ls-accent">01</span>
                           </div>
                       </div>
                       <div className="flex-1 hidden md:block"></div>
                   </div>

                   {/* Step 2 */}
                   <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 md:flex-row-reverse">
                       <div className="flex-1 text-center md:text-left">
                           <h3 className="text-2xl font-bold font-raleway text-ls-dark mb-3 uppercase tracking-wide">
                               Revisamos si tu zona está disponible
                           </h3>
                           <p className="text-gray-600 text-lg leading-relaxed font-raleway">
                               Analizamos territorios para que no haya saturación de revendedores.
                           </p>
                       </div>
                       <div className="shrink-0 flex items-center justify-center">
                           <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-100 shadow-sm flex items-center justify-center relative z-10">
                               <span className="text-xl font-bold font-raleway text-ls-accent">02</span>
                           </div>
                       </div>
                       <div className="flex-1 hidden md:block"></div>
                   </div>

                   {/* Step 3 */}
                   <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 md:text-right">
                       <div className="flex-1 text-center md:text-right">
                           <h3 className="text-2xl font-bold font-raleway text-ls-dark mb-3 uppercase tracking-wide">
                               Te ofrecemos catálogo y condiciones
                           </h3>
                           <p className="text-gray-600 text-lg leading-relaxed font-raleway">
                               Vas a conocer modelos, precios, márgenes y volúmenes mínimos.
                           </p>
                       </div>
                       <div className="shrink-0 flex items-center justify-center">
                           <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-100 shadow-sm flex items-center justify-center relative z-10">
                               <span className="text-xl font-bold font-raleway text-ls-accent">03</span>
                           </div>
                       </div>
                       <div className="flex-1 hidden md:block"></div>
                   </div>

                   {/* Step 4 */}
                   <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 md:flex-row-reverse">
                       <div className="flex-1 text-center md:text-left">
                           <h3 className="text-2xl font-bold font-raleway text-ls-dark mb-3 uppercase tracking-wide">
                               Primer pedido + armado de exhibición
                           </h3>
                           <p className="text-gray-600 text-lg leading-relaxed font-raleway">
                               Te ayudamos a elegir el mix inicial ideal para tu público y tu capital.
                           </p>
                       </div>
                       <div className="shrink-0 flex items-center justify-center">
                           <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-100 shadow-sm flex items-center justify-center relative z-10">
                               <span className="text-xl font-bold font-raleway text-ls-accent">04</span>
                           </div>
                       </div>
                       <div className="flex-1 hidden md:block"></div>
                   </div>

                   {/* Step 5 */}
                    <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 md:text-right">
                       <div className="flex-1 text-center md:text-right">
                           <h3 className="text-2xl font-bold font-raleway text-ls-dark mb-3 uppercase tracking-wide">
                               Te damos soporte para vender
                           </h3>
                           <p className="text-gray-600 text-lg leading-relaxed font-raleway">
                               Material gráfico, fotos, textos y guiones para redes, WhatsApp y local.
                           </p>
                       </div>
                       <div className="shrink-0 flex items-center justify-center">
                           <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-100 shadow-sm flex items-center justify-center relative z-10">
                               <span className="text-xl font-bold font-raleway text-ls-accent">05</span>
                           </div>
                       </div>
                       <div className="flex-1 hidden md:block"></div>
                   </div>

              </div>
          </div>
      </section>

      {/* 4. Catalog */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#151515] to-[#0a0a0a]">
          <div className="container mx-auto text-center mb-16 flex flex-col gap-3">
              <h2 className="text-2xl md:text-5xl font-imax uppercase mb-4">Una línea de motos pensada para lo que la gente realmente busca.</h2>
              <Button variant="ghost" className="text-ls-accent">
                   <Download size={16} className="mr-2"/> Descargar catálogo mayorista en PDF
              </Button>
          </div>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black p-6 rounded-xl border border-white/10 group hover:border-ls-accent/50 transition-colors">
                    <div className="h-48 mb-6 flex items-center justify-center bg-[#111] rounded-lg text-gray-400 group-hover:text-ls-accent group-hover:bg-[#151515] transition-all">
                        <Briefcase size={80} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 uppercase group-hover:text-ls-accent transition-colors"><span className="font-imax text-ls-accent">Motos LS</span> Trabajo</h3>
                    <p className="text-gray-400 text-sm">Diseñadas para repartos, mensajería y uso intensivo. Bajo consumo, mantenimiento económico, pensadas para laburar.</p>
                </div>
                <div className="bg-black p-6 rounded-xl border border-white/10 group hover:border-ls-accent/50 transition-colors">
                    <div className="h-48 mb-6 flex items-center justify-center bg-[#111] rounded-lg text-gray-400 group-hover:text-ls-accent group-hover:bg-[#151515] transition-all">
                        <Building2 size={80} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 uppercase group-hover:text-ls-accent transition-colors"><span className="font-imax text-ls-accent">Motos LS</span> Ciudad</h3>
                    <p className="text-gray-400 text-sm">Para quienes buscan movilidad ágil, cómoda y accesible. Perfectas para la vida diaria en la ciudad.</p>
                </div>
                <div className="bg-black p-6 rounded-xl border border-white/10 group hover:border-ls-accent/50 transition-colors">
                    <div className="h-48 mb-6 flex items-center justify-center bg-[#111] rounded-lg text-gray-400 group-hover:text-ls-accent group-hover:bg-[#151515] transition-all">
                        <Crown size={80} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 uppercase group-hover:text-ls-accent transition-colors"><span className="font-imax text-ls-accent">Motos LS</span> Premium</h3>
                    <p className="text-gray-400 text-sm">Para el cliente que quiere diseño, potencia y prestaciones superiores. Excelente opción para diferenciar tu local.</p>
                </div>
          </div>
      </section>
      
      {/* 5. Commercial Benefits */}
      <section id="conditions" className="py-24 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-ls-accent/20 via-black to-black text-white border-y border-white/10">
          <div className="container mx-auto px-4">
               <h2 className="text-2xl md:text-5xl font-imax uppercase mb-12 text-center text-white">¿Por qué sumar <span className="text-ls-accent">motos LS</span> a tu negocio?</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                   <div className="flex gap-4 items-start">
                       <div className="bg-ls-accent text-black p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center font-bold text-sm">✓</div>
                       <p className="font-bold text-lg leading-tight text-gray-200">Márgenes saludables pensados para que revender sea rentable de verdad.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                       <div className="bg-ls-accent text-black p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center font-bold text-sm">✓</div>
                       <p className="font-bold text-lg leading-tight text-gray-200">Mix de productos inteligente: modelos con salida, no fierros parados.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                       <div className="bg-ls-accent text-black p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center font-bold text-sm">✓</div>
                       <p className="font-bold text-lg leading-tight text-gray-200">Reposición y acompañamiento comercial para no dejarte solo con el stock.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                       <div className="bg-ls-accent text-black p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center font-bold text-sm">✓</div>
                       <p className="font-bold text-lg leading-tight text-gray-200">Apoyo en marketing: fotos, videos, copies y campañas listas para usar en redes.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                       <div className="bg-ls-accent text-black p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center font-bold text-sm">✓</div>
                       <p className="font-bold text-lg leading-tight text-gray-200">Posibilidad de territorio exclusivo, según zona y volumen.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                       <div className="bg-ls-accent text-black p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center font-bold text-sm">✓</div>
                       <p className="font-bold text-lg leading-tight text-gray-200">Relación directa con un ejecutivo para resolver dudas y trabajar a largo plazo.</p>
                   </div>
               </div>
          </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-linear-to-br from-[#000000] to-[#111111]">
           <div className="container mx-auto px-4 text-center">
               <h2 className="text-2xl md:text-5xl font-imax uppercase mb-12 text-ls-light">Historias de negocios que ya crecieron con <span className="text-ls-accent">motos LS</span></h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                   <div className="bg-[#111] p-8 border border-white/5 rounded-lg">
                       <p className="italic text-gray-300 mb-4">"Tenía un taller mecánico y empecé con 3 motos en exposición. En 6 meses, la venta de motos se volvió una de las patas principales del negocio."</p>
                       <p className="font-bold text-ls-accent">— Juan, taller en [Ciudad]</p>
                   </div>
                   <div className="bg-[#111] p-8 border border-white/5 rounded-lg">
                       <p className="italic text-gray-300 mb-4">"Sumamos <span className="font-imax text-ls-accent">motos LS</span> a nuestro local de accesorios, empezamos con un pedido chico y hoy estamos pensando en abrir una segunda sucursal."</p>
                       <p className="font-bold text-ls-accent">— María, local multimarca</p>
                   </div>
               </div>
           </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-gradient-to-b from-[#232323] to-black border-t border-white/10">
          <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-5xl font-imax uppercase mb-12 text-center text-white leading-tight w-full break-words hyphens-auto">Preguntas frecuentes de nuevos distribuidores</h2>
              <div className="space-y-6">
                  <div>
                      <h4 className="font-bold text-base md:text-lg text-white mb-2">¿Necesito tener local para vender <span className="font-imax text-ls-accent">motos LS</span>?</h4>
                      <p className="text-gray-400 text-sm">No necesariamente. Es ideal tener un espacio físico, pero trabajamos también con vendedores independientes según el caso.</p>
                  </div>
                  <div>
                      <h4 className="font-bold text-base md:text-lg text-white mb-2">¿Cuál es el pedido mínimo inicial?</h4>
                      <p className="text-gray-400 text-sm">Se define según tu zona y capacidad, pero siempre buscamos empezar con un esquema que te sea cómodo y rentable.</p>
                  </div>
                  <div>
                      <h4 className="font-bold text-base md:text-lg text-white mb-2">¿Ofrecen financiación para los clientes finales?</h4>
                      <p className="text-gray-400 text-sm">Sí, trabajamos con distintas alternativas. Podemos ayudarte a armar propuestas atractivas para tu público.</p>
                  </div>
                  <div>
                      <h4 className="font-bold text-base md:text-lg text-white mb-2">¿Qué soporte me dan en marketing?</h4>
                      <p className="text-gray-400 text-sm">Te entregamos fotos, videos, textos modelos, ideas de campañas y acompañamiento para tus redes.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* 8. Final CTA & FORM */}
      <section id="contact" className="py-24 bg-black relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                      <h2 className="text-4xl md:text-6xl font-bold font-imax uppercase mb-6 text-white leading-none">
                          Empezá a vender <span className="text-ls-accent">motos LS</span> en tu ciudad.
                      </h2>
                      <p className="text-gray-400 text-lg mb-8">
                          Contanos sobre tu negocio y te compartimos catálogo, condiciones y próximos pasos. Sin compromiso.
                      </p>
                  </div>
                  <div className="bg-[#111] p-8 md:p-10 rounded-xl border border-white/10 shadow-2xl shadow-ls-accent/5">
                      <ContactForm variant="dark" buttonText={<>Quiero ser distribuidor de <span className="font-imax text-ls-accent">motos LS</span></>} />
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <Footer />
      <WhatsAppButton />
>>>>>>> Stashed changes
    </div>
  );
}
