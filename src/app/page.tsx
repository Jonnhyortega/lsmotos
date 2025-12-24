import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center">
        <h1 className="text-4xl font-bold">Motos LS Project</h1>
        <p className="text-lg text-gray-400"></p>
        
        <Link href="/landing">
          <Button size="lg" className="uppercase tracking-widest">
            Ver Opciones de Diseño
          </Button>
        </Link>
      </main>
    </div>
  );
}
