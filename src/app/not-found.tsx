import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center selection:bg-ls-accent selection:text-black">
      <div className="relative">
        <h1 className="text-9xl font-bold font-imax text-ls-accent/20 select-none blur-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150">404</h1>
        <h1 className="text-9xl font-bold font-imax text-ls-accent mb-4 tracking-tighter relative z-10">404</h1>
      </div>
      <h2 className="text-2xl md:text-4xl font-raleway font-bold uppercase mb-6">Página no encontrada</h2>
      <p className="text-gray-400 max-w-md mb-10 font-raleway text-lg">
        La ruta que intentas buscar no existe o ha sido movida.
      </p>
      <Link href="/">
        <Button size="lg" className="uppercase tracking-widest gap-2 pl-6 pr-8">
          <ArrowLeft size={20} />
          Volver al Inicio
        </Button>
      </Link>
    </div>
  )
}
