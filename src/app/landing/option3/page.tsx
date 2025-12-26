"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Plus, ChevronDown, Download, User, MapPin, Menu, X, Briefcase, Building2, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/landing/ContactForm";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useState, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";

export default function Option3Page() {
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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-ls-accent selection:text-black p-4">
      
      {/* 1. Navbar Minimalist */}
      <nav className="fixed w-full z-50 top-0 left-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="relative container  mx-auto p-8 h-16 flex justify-between items-center">
            <Link href="/landing" className="absolute left-3  hover:text-white transition-colors z-101">
                <ArrowLeft size={18} color="white" />
            </Link>
            <Image src="/images/LOGO2W.png" alt="Logo" width={70} height={90} />
            <div className="flex items-center gap-4 z-101">
                {/* <LanguageSwitcher /> */}
                <Button size="sm" variant="outline" className="hidden md:flex rounded-full px-6 border-white/20 text-white hover:bg-white hover:text-black hover:border-white transition-all">
                    {content.hero.cta}
                </Button>
                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
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
                    className="fixed inset-0 top-0 left-0 z-[999] bg-[#050505] h-screen w-screen flex flex-col items-center justify-center md:hidden"
                >
                    <button 
                            className="absolute top-6 right-6 text-gray-400 p-2 hover:text-white transition-colors"
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
                        {/* Logo */}
                        <div className="w-24 mb-8">
                             <Image src="/images/LOGO2W.png" alt="Logo" width={100} height={120} className="w-full h-auto" />
                        </div>
                        
                        <nav className="flex flex-col gap-8 text-center w-full">
                             <span className="text-2xl font-bold text-gray-300 hover:text-white transition-colors font-imax uppercase tracking-widest cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Inicio</span>
                             {/* Add more links if needed for Option 3 sections, currently just Inicio based on prev availability */}
                        </nav>

                        <div className="w-full max-w-xs pt-8 border-t border-white/10 mt-4">
                            <Button 
                                onClick={() => {
                                    // Option 3 generic scroll or close
                                    setIsMobileMenuOpen(false);
                                }}
                                 className="w-full py-7 text-lg font-bold font-imax uppercase tracking-widest bg-ls-accent text-black hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,206,254,0.4)] rounded-full flex items-center justify-center gap-2"
                            >
                                {content.hero.cta} <ChevronDown className="-rotate-90" strokeWidth={3} size={20} />
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* 1. Hero Section - Premium Bento Style */}
      <section className="pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-7xl flex flex-col items-center justify-center">
              <div className="flex flex-col items-center text-center mb-16">
                   <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-4xl lg:text-5xl font-bold font-imax uppercase leading-[1.1] mb-6 max-w-4xl break-words hyphens-auto"
                   >
                       {content.hero.title}
                   </motion.h1>
                   <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light mb-8">
                       {content.hero.subtitle}
                   </p>
                   <Button size="lg" className="rounded-full px-8 text-lg hover:scale-105 transition-transform">
                       {content.hero.cta}
                   </Button>
              </div>             
              <Image src="/images/LOGO2W.png" alt="Hero Moto" width={200} height={200} />
          </div>
      </section>

      {/* 2. Benefit Directo - Dark Card */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-imax uppercase mb-6">{content.benefits.title}</h2>
                      <p className="text-gray-400 mb-8 leading-relaxed">
                          {content.benefits.description}
                      </p>
                      <ul className="space-y-6">
                            {content.benefits.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#111] border border-white/5 hover:border-ls-accent/30 transition-colors">
                                    <div className="bg-ls-accent p-2 rounded-full text-ls-accent flex items-end w-full">
                                        <Check size={20} />
                                    </div>
                                    <span className="text-gray-200 font-medium">{item.text}</span>
                                </li>
                            ))}
                      </ul>
                      <div className="mt-8">
                          <button className="text-ls-accent font-bold hover:underline underline-offset-4 flex items-center gap-2">
                              {content.benefits.cta} <ChevronDown size={16} className="-rotate-90" />
                          </button>
                      </div>
                  </div>
                  {/* <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-white/5">
                        <Image 
                            src="/images/motols.png" 
                            alt="Beneficios Directos"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <h4 className="font-imax text-xl text-white mb-1">Soporte Integral</h4>
                            <p className="text-xs text-gray-400">Materiales y capacitación constante.</p>
                        </div>
                  </div> */}
              </div>
          </div>
      </section>

      {/* 3. How It Works - Horizontal Scroll / Steps */}
      <section className="py-24 border-y border-white/5">
          <div className="container mx-auto px-4 max-w-7xl">
              <h2 className="text-center text-3xl md:text-5xl font-imax uppercase mb-16">{content.howItWorks.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {content.howItWorks.steps.map((step, i) => (
                      <div key={i} className="relative p-6 pt-12 rounded-2xl bg-[#0f0f0f] border border-white/5 group hover:bg-[#151515] transition-colors">
                          <span className="absolute -top-4 right-0 text-4xl font-imax opacity-10 group-hover:opacity-30 transition-opacity text-ls-accent">
                              {step.step}
                          </span>
                          <h3 className="font-bold text-lg mb-3 leading-tight">{step.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. Catalog - Big Cards */}
      <section className="py-24 px-4 bg-[#080808]">
          <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <h2 className="text-3xl md:text-5xl font-imax uppercase max-w-2xl">{content.catalog.title}</h2>
                  <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-white/20 text-white hover:bg-white hover:text-black">
                      <Download size={18} /> {content.catalog.cta}
                  </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {content.catalog.segments.map((segment: any, i: number) => {
                       const icons = [Briefcase, Building2, Crown];
                       const Icon = icons[i] || Briefcase;
                      
                      return (
                      <div key={i} className="group relative bg-[#111] rounded-3xl p-8 border border-white/5 overflow-hidden hover:border-ls-accent/40 transition-all duration-500">
                          {/* Hover Gradient */}
                          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-ls-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          
                          <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mb-10 group-hover:bg-ls-accent group-hover:text-black transition-colors duration-300">
                              <Icon size={40} strokeWidth={1.5} />
                          </div>
                          
                          <h3 className="text-3xl font-imax uppercase mb-4 text-white group-hover:text-ls-accent transition-colors">
                            {segment.title}
                          </h3>
                          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                              {segment.description}
                          </p>
                          
                          <div className="pt-8 border-t border-white/5">
                             <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                                  Ver Modelos <ArrowLeft className="rotate-180" size={16} />
                             </Link>
                          </div>
                      </div>
                  )})}
              </div>
              
              <div className="mt-12 text-center md:hidden">
                  <Button variant="outline" className="w-full gap-2 rounded-full">
                      <Download size={18} /> {content.catalog.cta}
                  </Button>
              </div>
          </div>
      </section>

      {/* 5. Benefits Grid (Bento) */}
      <section className="py-24 px-4 bg-[#050505]">
          <div className="container mx-auto max-w-5xl text-center mb-16">
              <h2 className="text-3xl font-imax uppercase mb-6">{content.commercialBenefits.title}</h2>
          </div>
          <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.commercialBenefits.items.map((item, i) => (
                      <div key={i} className="bg-[#0f0f0f] p-8 rounded-2xl border border-white/5 hover:border-ls-accent/20 transition-colors">
                          <Plus className="text-ls-accent mb-4" />
                          <p className="text-lg font-medium text-gray-200">{item}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
          <div className="container mx-auto px-4 max-w-4xl text-center">
               <h2 className="text-2xl font-imax uppercase mb-16 text-gray-500">{content.testimonials.title}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {content.testimonials.cases.map((t, i) => (
                       <div key={i} className="relative">
                           <div className="text-4xl text-ls-accent font-serif absolute -top-4 -left-2">"</div>
                           <p className="text-xl md:text-2xl text-white font-light italic mb-6 relative z-10">
                               {t.quote}
                           </p>
                           <div className="flex items-center justify-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                   <User size={14} />
                               </div>
                               <span className="text-sm font-bold uppercase tracking-wider text-gray-400">{t.author}</span>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 px-4">
          <div className="container mx-auto max-w-3xl">
              <h2 className="text-xl md:text-3xl font-imax uppercase mb-12 text-center text-white/90">{content.faq.title}</h2>
              <div className="space-y-4">
                  {content.faq.questions.map((faq, i) => (
                      <div key={i} className="border-b border-white/10 pb-6 mb-6 last:border-0">
                          <h4 className="text-xl font-bold mb-3 text-white">{faq.q}</h4>
                          <p className="text-gray-400">{faq.a}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-24 px-4 bg-ls-accent text-black">
          <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-4xl md:text-6xl font-imax uppercase mb-6 leading-none">
                  {content.finalCta.title}
              </h2>
              <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl mx-auto opacity-90">
                  {content.finalCta.description}
              </p>
              
              <div id="contact-form-container" className="p-1 md:p-8 rounded-3xl backdrop-blur-sm">
                   <div className="bg-ls-dark text-white rounded-2xl p-8 md:p-12 shadow-2xl text-left max-w-lg mx-auto">
                        <ContactForm variant="dark" buttonText={content.finalCta.button} />
                   </div>
              </div>
          </div>
      </section>

      <Footer />
    </div>
  );
}
