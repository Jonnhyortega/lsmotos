"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-50">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-2 text-current bg-transparent border-0 hover:bg-white/10">
                <Globe size={18} />
                <span className="uppercase font-bold">{language}</span>
            </Button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-xl overflow-hidden min-w-[120px]"
                    >
                        <button 
                            onClick={() => { setLanguage('es'); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center justify-between ${language === 'es' ? 'font-bold text-ls-accent' : ''}`}
                        >
                            Español
                        </button>
                        <button 
                            onClick={() => { setLanguage('en'); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center justify-between ${language === 'en' ? 'font-bold text-ls-accent' : ''}`}
                        >
                            English
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
