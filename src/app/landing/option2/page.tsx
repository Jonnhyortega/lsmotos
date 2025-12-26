"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Building2, Briefcase, Crown, ChevronDown, Plus, Minus, Trophy, TrendingUp, Package, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/landing/ContactForm";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useState, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";
import { logos } from "@/constants/logos";

export default function Option2Page() {
  const { content } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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
    <div className="min-h-screen bg-white text-ls-dark font-sans selection:bg-ls-accent selection:text-white">
      
      {/* Light Header */}
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-4 z-101">
                <Link href="/landing" className="text-gray-400 hover:text-ls-dark transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="text-xl font-bold font-imax tracking-wide">
                    <img 
                        src="https://res.cloudinary.com/do87isqjr/image/upload/v1766579785/Captura_de_pantalla_2025-12-24_001630-removebg-preview_gbkkjk.png" 
                        alt="LS Motos Logo"
                        width={50}
                        height={50} 
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 z-101">
                {/* <LanguageSwitcher /> */}
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                    <a href="#benefits" className="hover:text-ls-dark transition-colors">Beneficios</a>
                    <a href="#steps" className="hover:text-ls-dark transition-colors">Cómo Funciona</a>
                    <a href="#catalog" className="hover:text-ls-dark transition-colors">Catálogo</a>
                </div>
                <Button size="sm" className="hidden md:flex" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})}>
                    Ser Distribuidor
                </Button>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden p-2 text-gray-600 hover:text-ls-dark transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 top-0 left-0 z-[999] bg-white h-screen w-screen flex flex-col items-center justify-center md:hidden"
                >
                    <button 
                            className="absolute top-6 right-6 text-gray-800 p-2 hover:text-ls-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={32} />
                    </button>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center gap-10 w-full px-8"
                    >
                        {/* Logo in Menu */}
                        <div className="w-40 mb-4">
                             <Image
                                src={logos.whiteLogo}
                                alt="LS Motos Logo"
                                width={100}
                                height={100}
                            />
                        </div>
                        
                        <nav className="flex flex-col gap-6 text-center w-full">
                            <a href="#benefits" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-ls-dark hover:text-ls-accent transition-colors font-imax uppercase tracking-wide">Beneficios</a>
                            <a href="#steps" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-ls-dark hover:text-ls-accent transition-colors font-imax uppercase tracking-wide">Cómo Funciona</a>
                            <a href="#catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-ls-dark hover:text-ls-accent transition-colors font-imax uppercase tracking-wide">Catálogo</a>
                        </nav>

                        <div className="w-full max-w-xs pt-4 border-t border-gray-100">
                             <Button 
                                onClick={() => {
                                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'});
                                    setIsMobileMenuOpen(false);
                                }}
                                 className="w-full py-6 text-lg font-bold uppercase tracking-widest shadow-lg shadow-ls-accent/20"
                            >
                                Ser Distribuidor
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </header>

      {/* 1. Lifestyle Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ls-accent/10 border border-ls-accent/20 mb-6 w-fit">
                    <Building2 size={14} className="text-ls-accent" />
                    <span className="text-ls-accent font-bold tracking-widest uppercase text-xs">
                        Distribución Mayorista
                    </span>
                </div>
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold font-imax text-ls-dark mb-8 leading-[1.1] uppercase max-w-[20ch] wrap-break-word hyphens-auto">
                    {content.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl font-sans">
                    {content.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})}>
                        {content.hero.cta}
                    </Button>
                </div>
            </motion.div>
        </div>
      </section>

      {/* 2. Benefits (Directo Pymes) */}
      <section id="benefits" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold font-imax mb-6 max-w-3xl mx-auto">{content.benefits.title}</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">{content.benefits.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {content.benefits.items.map((b: any, i: number) => (
                       <div key={i} className="flex flex-col items-center justify-center gap-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-ls-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className="w-12 h-12 bg-ls-accent/5 rounded-full flex items-center justify-center text-ls-accent mb-4 group-hover:bg-ls-accent/10 transition-colors">
                                <Check size={24} />
                           </div>
                           <p className="text-gray-800 font-medium leading-snug">{b.text}</p>
                       </div>
                   ))}
              </div>
              <div className="text-center mt-12">
                   <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-ls-dark cursor-pointer" onClick={() => document.getElementById('commercial-benefits')?.scrollIntoView({ behavior: 'smooth'})}>
                       {content.benefits.cta}
                   </Button>
              </div>
          </div>
      </section>

      {/* 3. How It Works */}
      <section id="steps" className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold font-imax mb-16 text-center">{content.howItWorks.title}</h2>
            <div className="space-y-12 relative">
                 {/* Vertical line connection (visual) */}
                 <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100 md:left-1/2 md:-translate-x-1/2 z-0 hidden md:block" />
                 
                 {content.howItWorks.steps.map((step: any, i: number) => (
                     <div key={i} className={` flex flex-col md:flex-row gap-8 border-l-2 border-ls-accent pl-8 relative z-10 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                         <div className="group flex-1 md:text-right hidden md:block">
                             {i % 2 === 0 && (
                                <>
                                    <h3 className="text-xl font-bold text-ls-dark mb-2">{step.title}</h3>
                                    <p className="text-gray-500">{step.description}</p>
                                </>
                             )}
                         </div>
                         
                         <div className="shrink-0 flex items-center justify-start md:justify-center">
                             <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center shadow-sm">
                                <span className="text-ls-accent font-bold font-imax text-lg">{step.step}</span>
                             </div>
                             <div className="md:hidden ml-4">
                                <h3 className="text-xl font-bold text-ls-dark mb-1">{step.title}</h3>
                                <p className="text-gray-500 text-sm">{step.description}</p>
                             </div>
                         </div>
                         
                         <div className="flex-1 hidden md:block">
                             {i % 2 !== 0 && (
                                <>
                                    <h3 className="text-xl font-bold text-ls-dark mb-2">{step.title}</h3>
                                    <p className="text-gray-500">{step.description}</p>
                                </>
                             )}
                         </div>
                     </div>
                 ))}
            </div>
        </div>
      </section>

      {/* 4. Catalog */}
      <section id="catalog" className="py-24 bg-ls-dark text-white">
          <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <h2 className="text-3xl font-imax max-w-xl">{content.catalog.title}</h2>
                <Button className="border-white text-white hover:bg-white hover:text-black hover:border-white" variant="outline">
                    {content.catalog.cta}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {content.catalog.segments.map((seg: any, i: number) => {
                       const icons = [Briefcase, Building2, Crown];
                       const Icon = icons[i] || Briefcase;
                       const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"]; // just accents

                       return (
                           <motion.div 
                                whileHover={{ y: -5 }} 
                                key={i} 
                                className="bg-[#2a2a2a] rounded-2xl p-8 border border-white/5 hover:border-ls-accent/50 transition-colors"
                           >
                               <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 text-ls-accent">
                                   <Icon size={24} />
                               </div>
                               <h3 className="text-xl font-bold font-imax mb-3 uppercase tracking-wide">{seg.title}</h3>
                               <p className="text-gray-400 text-sm leading-relaxed">{seg.description}</p>
                           </motion.div>
                       )
                  })}
              </div>
          </div>
      </section>

      {/* 5. Commercial Benefits */}
      <section id="commercial-benefits" className="py-24 bg-white">
           <div className="container mx-auto px-4 max-w-5xl">
               <h2 className="text-3xl font-bold font-imax mb-12 text-center text-ls-dark">{content.commercialBenefits.title}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                   {content.commercialBenefits.items.map((item: string, i: number) => (
                       <div key={i} className="flex gap-4 items-start p-4 rounded-lg hover:bg-gray-50 transition-colors">
                           <div className="w-6 h-6 rounded-full bg-ls-accent shrink-0 flex items-center justify-center mt-0.5">
                               <Check size={14} className="text-white" strokeWidth={3} />
                           </div>
                           <p className="text-gray-700 font-medium">{item}</p>
                       </div>
                   ))}
               </div>
           </div>
      </section>

      {/* 6. Testimonials / Cases */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-imax text-center mb-10 text-gray-400 uppercase tracking-widest">{content.testimonials.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {content.testimonials.cases.map((c: any, i: number) => (
                      <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <p className="text-gray-600 italic mb-6 leading-relaxed">"{c.quote}"</p>
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                  {c.author.charAt(0)}
                              </div>
                              <p className="font-bold text-ls-dark text-sm">{c.author}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-bold font-imax mb-12 text-center">{content.faq.title}</h2>
              <div className="space-y-4">
                  {content.faq.questions.map((q: any, i: number) => {
                      const isOpen = openFaqIndex === i;
                      return (
                          <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                              <button 
                                  onClick={() => toggleFaq(i)}
                                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                              >
                                  <span className="font-bold text-ls-dark">{q.q}</span>
                                  {isOpen ? <Minus size={20} className="text-ls-accent" /> : <Plus size={20} className="text-gray-400" />}
                              </button>
                              <AnimatePresence>
                                  {isOpen && (
                                      <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="overflow-hidden"
                                      >
                                          <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
                                              {q.a}
                                          </div>
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                          </div>
                      )
                  })}
              </div>
          </div>
      </section>

      {/* 8. Final CTA & Contact Form */}
      <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
              <div className="bg-gray-50 rounded-3xl p-8 md:p-12 lg:p-16 border border-gray-100 shadow-xl overflow-hidden relative">
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-ls-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                      <div className="flex flex-col justify-center">
                          <h2 className="text-3xl md:text-4xl font-bold font-imax mb-6 text-ls-dark leading-tight">
                              {content.finalCta.title}
                          </h2>
                          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                              {content.finalCta.description}
                          </p>
                          <div className="hidden lg:block">
                              <div className="flex items-center gap-4 mb-2">
                                  <div className="w-10 h-10 rounded-full bg-ls-accent/10 flex items-center justify-center">
                                      <Building2 size={20} className="text-ls-accent" />
                                  </div>
                                  <div>
                                      <p className="font-bold text-ls-dark">Soporte Directo</p>
                                      <p className="text-xs text-gray-500">Te acompañamos en todo el proceso</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                          <ContactForm variant="light" buttonText={content.finalCta.button} />
                          <p className="text-center text-xs text-gray-400 mt-4">Tus datos están protegidos.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <Footer />
    </div>
  );
}
