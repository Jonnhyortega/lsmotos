"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface ContactFormProps {
  variant?: "dark" | "light" | "industrial";
  buttonText?: string;
}

export const ContactForm = ({ variant = "dark", buttonText = "SOLICITAR ALTA DE DISTRIBUIDOR" }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'Distributor' // Explicitly marking these as potential distributors
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        console.error(data.error);
        setStatus("error");
        // Optional: Reset status after a few seconds
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Submission failed", error);
      setStatus("error");
    }
  };

  const inputClasses = 
    variant === "industrial" 
      ? "w-full bg-ls-dark/50 border-b-2 border-ls-light/20 focus:border-ls-accent outline-none py-3 px-2 transition-colors placeholder:text-ls-light/30 font-mono text-sm"
      : variant === "light"
      ? "w-full bg-white border border-gray-300 rounded-md py-3 px-4 focus:ring-2 focus:ring-ls-accent outline-none text-ls-dark"
      : "w-full bg-ls-light/5 border border-ls-light/10 rounded-md py-3 px-4 focus:border-ls-accent outline-none text-ls-light focus:bg-ls-light/10 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Nombre Completo</label>
          <input
            required
            type="text"
            className={inputClasses}
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Empresa / Taller</label>
          <input
            required
            type="text"
            className={inputClasses}
            placeholder="Motos Juan"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 opacity-80">Email</label>
        <input
          required
          type="email"
          className={inputClasses}
          placeholder="juan@email.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 opacity-80">Teléfono</label>
        <input
          required
          type="tel"
          className={inputClasses}
          placeholder="+54 11 ..."
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 opacity-80">Mensaje</label>
        <textarea
          rows={4}
          className={inputClasses}
          placeholder="Estoy interesado en..."
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={status === "submitting" || status === "success"}
          className="w-full"
          variant={variant === "industrial" ? "outline" : "primary"}
        >
          {status === "submitting" ? "Enviando..." : status === "success" ? "¡Mensaje Enviado!" : buttonText}
        </Button>
      </div>
    </form>
  );
};

