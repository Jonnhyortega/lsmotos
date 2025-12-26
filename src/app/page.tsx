import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { logos } from "@/constants/logos";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans ">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center">
        {/* <h1 className="text-4xl font-bold sr-only">
          Motos LS Project
        </h1> */}
        <Image src={logos.whiteLogo} className="m-auto drop-shadow-2xl-[10px_10px_10px_rgba(255,0,0,0.5)]" alt="Logo" width={200} height={150} />
        <p className="text-lg text-center w-[90%] m-auto text-gray-400">Propuestas de landing page para motos LS</p>
        <div className="flex flex-col items-center gap-4" >
          <Link href="/landing" className="">
          <Button size="md" className="uppercase tracking-widest m-auto ">
            Ver Opciones de Diseño
          </Button>
        </Link>
        <Link href="/admin">
          <Button size="md" className="uppercase tracking-widest m-auto ">
            Panel admin para gestion de subscriptores
          </Button>
        </Link>
        </div>
        
      </main>
    </div>
  );
}
