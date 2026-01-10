'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useState, useEffect } from 'react';

export type DialogVariant = 'info' | 'success' | 'error';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  variant?: DialogVariant;
  onConfirm?: () => void | Promise<void>;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  variant = 'info',
  onConfirm
}: ConfirmDialogProps) {
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when dialong opens/closes
  useEffect(() => {
    if (isOpen) setIsProcessing(false);
  }, [isOpen]);

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

  const handleConfirm = async () => {
    if (!onConfirm) {
        onClose();
        return;
    }

    try {
        setIsProcessing(true);
        await onConfirm();
        // We generally expect the parent to close the dialog, but we could also auto-close if needed.
        // Usually if onConfirm throws, we stay open needed?
        // Let's assume onConfirm handles logic.
    } catch (error) {
        console.error("Confirmation action failed", error);
        // Optionally show error state?
    } finally {
        setIsProcessing(false);
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
            onClick={!isProcessing ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            {!isProcessing && (
                <div className="absolute top-4 right-4">
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>
                </div>
            )}

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
                        <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isProcessing}>
                        Cancelar
                        </Button>
                        <Button 
                            variant={variant === 'error' ? 'danger' : 'primary'} 
                            onClick={handleConfirm}
                            className="flex-1 flex items-center justify-center gap-2"
                            disabled={isProcessing}
                        >
                        {isProcessing && <Loader2 className="animate-spin w-4 h-4" />}
                        {isProcessing ? 'Procesando...' : 'Confirmar'}
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
