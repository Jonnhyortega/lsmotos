"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  variant?: "dark" | "light" | "industrial";
  buttonText?: string | ReactNode;
} 

export const ContactForm = ({ variant = "dark", buttonText = "SOLICITAR ALTA DE DISTRIBUIDOR" }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    city: "",
    province: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const router = useRouter();

  const ARGENTINA_PROVINCES = [
    "Ciudad Autónoma de Buenos Aires",
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          city: formData.province ? `${formData.city} (${formData.province})` : formData.city, // Combine for backend
          type: 'Distributor' 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        router.push('/lsmotos-contact');
      } else {
        console.error(data.error);
        setStatus("error");
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
          <label className="block text-sm font-medium mb-2 opacity-80">Nombre Completo <span className="text-ls-accent">*</span></label>
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
          <label className="block text-sm font-medium mb-2 opacity-80">Email <span className="text-ls-accent">*</span></label>
          <input
            required
            type="email"
            className={inputClasses}
            placeholder="juan@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium mb-2 opacity-80">Provincia <span className="text-ls-accent">*</span></label>
           <select 
              required
              className={`${inputClasses} appearance-none cursor-pointer`}
              value={formData.province}
              onChange={(e) => {
                const selectedProvince = e.target.value;
                const isCaba = selectedProvince === "Ciudad Autónoma de Buenos Aires";
                setFormData({
                  ...formData,
                  province: selectedProvince,
                  city: isCaba ? "Ciudad Autónoma de Buenos Aires" : (formData.province === "Ciudad Autónoma de Buenos Aires" ? "" : formData.city)
                });
              }}
           >
              <option value="" disabled className="text-gray-500">Seleccionar...</option>
              {ARGENTINA_PROVINCES.map(p => (
                  <option key={p} value={p} className="text-black">{p}</option>
              ))}
           </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Ciudad <span className="text-ls-accent">*</span></label>
          <input
            required
            type="text"
            className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="Tu ciudad"
            value={formData.city}
            disabled={formData.province === "Ciudad Autónoma de Buenos Aires"}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Empresa / Taller <span className="text-xs opacity-50">(Opcional)</span></label>
            <input
              type="text"
              className={inputClasses}
              placeholder="Motos Juan"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Teléfono <span className="text-xs opacity-50">(Opcional)</span></label>
            <input
              type="tel"
              className={inputClasses}
              placeholder="+54 11 ..."
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
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
          {status === "submitting" ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Enviando...</span>
            </div>
          ) : status === "success" ? "¡Mensaje Enviado!" : buttonText}
        </Button>
      </div>
    </form>
  );
};

