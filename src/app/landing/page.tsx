"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function LandingIndex() {
  const { content } = useLanguage();

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-8 relative">
      <div className="absolute top-8 right-8">
          <LanguageSwitcher />
      </div>
      <div className="max-w-4xl w-full text-center space-y-12">
        <h1 className="text-5xl md:text-7xl font-bold font-imax tracking-tighter uppercase mb-4">
          Motos LS <span className="text-ls-accent">{content.selection.title}</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {content.selection.subtitle}
        </p>

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
    </div>
  );
}
