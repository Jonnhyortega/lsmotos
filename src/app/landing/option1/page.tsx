"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Building2, Check, ChevronDown, Crown, Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/landing/ContactForm";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { LANDING_CONTENT } from "@/constants/content";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";
import Image from "next/image";

export default function Option1Page() {
  const { content } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-ls-accent selection:text-black font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-100 p-4 md:p-6 flex justify-between items-center bg-black border-b border-white/10">
        <div className="flex items-center gap-4 z-101">
            <Link href="/landing" className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity font-bold uppercase tracking-widest relative">
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Volver</span>
            </Link>
            {/* <div className="relative">
                <LanguageSwitcher />
            </div> */}
        </div>
        
        <div className="text-xl md:text-2xl font-imax font-bold absolute left-1/2 -translate-x-1/2 pointer-events-none">MOTOS LS</div>

        {/* Desktop CTA */}
        <div className="hidden md:block z-101">
             <Button variant="outline" size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})}>
                CONTACTAR
            </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
            className="md:hidden z-101 p-2 text-white hover:text-ls-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-200 bg-zinc-950 flex flex-col items-center justify-center md:hidden"
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden ">
        {/* <div className="absolute inset-0 z-0">             
             <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/50" />
        </div> */}

        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center justify-center h-full p-2"
        >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-imax tracking-tight uppercase leading-[1.1] lg:mt-20 mb-6 max-w-5xl mx-auto wrap-break-word hyphens-auto">
                {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
                {content.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="uppercase tracking-widest text-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})}>
                    {content.hero.cta}
                </Button>
            </div>
        </motion.div>
      </section>

      {/* 2. Benefits Section (Directo) */}
      <section className="py-24 bg-linear-to-b from-[#0a0a0a] to-[#151515]">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                 <h2 className="text-2xl font-imax uppercase mb-4">{content.benefits.title}</h2>
                 <p className="text-gray-400 max-w-2xl mx-auto">{content.benefits.description}</p>
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
                {content.benefits.items.map((item : any, idx: number) => (
                    <motion.div 
                        key={idx}
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={{ backgroundColor: '#111', zIndex: 10 }}
                        className="bg-[#0f0f0f] border border-white/5 p-8 flex flex-col gap-4 group hover:border-ls-accent/50 transition-all duration-300"
                    >
                        <div className="text-ls-accent/80 group-hover:text-ls-accent transition-colors w-fit">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <p className="text-white font-bold text-lg leading-snug">{item.text}</p>
                    </motion.div>
                ))}
            </motion.div>
            <div className="text-center mt-12">
                 <Button variant="outline" onClick={() => document.getElementById('conditions')?.scrollIntoView({ behavior: 'smooth'})}>
                     {content.benefits.cta}
                 </Button>
            </div>
         </div>
      </section>

      {/* 3. How It Works (Simple) */}
      <section className="py-24 bg-linear-to-b from-[#000000] to-[#0a0a0a] border-y border-white/10">
          <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-5xl font-imax uppercase mb-12 text-center text-ls-accent">{content.howItWorks.title}</h2>
              <div className="space-y-8">
                  {content.howItWorks.steps.map((step: any, i: number) => (
                      <div key={i} className="flex gap-6 items-start">
                          <span className="text-2xl md:text-4xl font-imax text-gray-700">{step.step}</span>
                          <div>
                              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                              <p className="text-gray-400">{step.description}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. Catalog */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#151515] to-[#0a0a0a]">
          <div className="container mx-auto text-center mb-16 flex flex-col gap-3">
              <h2 className="text-2xl md:text-5xl font-imax uppercase mb-4">{content.catalog.title}</h2>
              <Button variant="ghost" className="text-ls-accent">
                   <Download size={16} className="mr-2"/> {content.catalog.cta}
              </Button>
          </div>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.catalog.segments.map((seg: any, i: number) => {
                  const icons = [Briefcase, Building2, Crown];
                  const Icon = icons[i as number] || Briefcase;
                  
                  return (
                  <div key={i} className="bg-black p-6 rounded-xl border border-white/10 group hover:border-ls-accent/50 transition-colors">
                      <div className="h-48 mb-6 flex items-center justify-center bg-[#111] rounded-lg text-gray-400 group-hover:text-ls-accent group-hover:bg-[#151515] transition-all">
                           <Icon size={80} strokeWidth={1} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 uppercase group-hover:text-ls-accent transition-colors">{seg.title}</h3>
                      <p className="text-gray-400 text-sm">{seg.description}</p>
                  </div>
                  );
              })}
          </div>
      </section>
      
      {/* 5. Commercial Benefits */}
      <section id="conditions" className="py-24 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-ls-accent/20 via-black to-black text-white border-y border-white/10">
          <div className="container mx-auto px-4">
               <h2 className="text-2xl md:text-5xl font-imax uppercase mb-12 text-center text-ls-accent">{content.commercialBenefits.title}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                   {content.commercialBenefits.items.map((item: any, i: number) => (
                       <div key={i} className="flex gap-4 items-start">
                           <div className="bg-ls-accent text-black p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center font-bold text-sm">✓</div>
                           <p className="font-bold text-lg leading-tight text-gray-200">{item}</p>
                       </div>
                   ))}
               </div>
          </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-linear-to-br from-[#000000] to-[#111111]">
           <div className="container mx-auto px-4 text-center">
               <h2 className="text-2xl md:text-5xl font-imax uppercase mb-12 text-ls-light">{content.testimonials.title}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                   {content.testimonials.cases.map((c: any, i: number) => (
                       <div key={i} className="bg-[#111] p-8 border border-white/5 rounded-lg">
                           <p className="italic text-gray-300 mb-4">"{c.quote}"</p>
                           <p className="font-bold text-ls-accent">— {c.author}</p>
                       </div>
                   ))}
               </div>
           </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-gradient-to-b from-[#232323] to-black border-t border-white/10">
          <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-5xl font-imax uppercase mb-12 text-center text-white leading-tight w-full break-words hyphens-auto">{content.faq.title}</h2>
              <div className="space-y-6">
                  {content.faq.questions.map((q: any, i: number) => (
                      <div key={i}>
                          <h4 className="font-bold text-base md:text-lg text-white mb-2">{q.q}</h4>
                          <p className="text-gray-400 text-sm">{q.a}</p>
                      </div>
                  ))}
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
                          {LANDING_CONTENT.finalCta.title}
                      </h2>
                      <p className="text-gray-400 text-lg mb-8">
                          {LANDING_CONTENT.finalCta.description}
                      </p>
                  </div>
                  <div className="bg-[#111] p-8 md:p-10 rounded-xl border border-white/10 shadow-2xl shadow-ls-accent/5">
                      <ContactForm variant="dark" buttonText={LANDING_CONTENT.finalCta.button} />
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
