'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from './Button';

export type DialogVariant = 'info' | 'success' | 'error';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  variant?: DialogVariant;
  onConfirm?: () => void;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  variant = 'info',
  onConfirm
}: ConfirmDialogProps) {
  
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-12 h-12 text-red-500" />;
      default:
        return <Info className="w-12 h-12 text-ls-accent" />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
        onConfirm();
    }
    // If it's just an info dialog, confirming usually means closing or acknowledging
    // But typically the parent controls state. We can call onClose if onConfirm is not provided?
    // Actually typically onConfirm is for the "Yes" action.
    if (!onConfirm) {
        onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center text-center">
              <div className="mb-4">
                {getIcon()}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 font-imax tracking-wide">
                {title}
              </h3>
              
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                {description}
              </p>

              <div className="flex gap-3 w-full justify-center">
                {onConfirm ? (
                    <>
                        <Button variant="ghost" onClick={onClose} className="flex-1">
                        Cancelar
                        </Button>
                        <Button 
                            variant={variant === 'error' ? 'danger' : 'primary'} 
                            onClick={handleConfirm}
                            className="flex-1"
                        >
                        Confirmar
                        </Button>
                    </>
                ) : (
                    <Button variant="primary" onClick={onClose} className="w-full">
                        Entendido
                    </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
