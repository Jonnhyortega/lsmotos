'use client';

import { logos } from '@/constants/logos';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BrandLoaderProps {
  size?: 'fullscreen' | 'default';
  className?: string;
}

export function BrandLoader({ size = 'default', className = '' }: BrandLoaderProps) {
  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="relative w-24 h-24 md:w-32 md:h-32"
        >
          <Image 
            src={logos.whiteLogo || "/images/logo-placeholder.png"} 
            alt="Loading..." 
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-ls-accent border-t-transparent rounded-full"
        />
    </div>
  );
}
