import type { Metadata } from "next";
import localFont from "next/font/local";
import { Michroma, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-imax", // Aliasing to our variable
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const imaxStandard = localFont({
  src: [
    {
      path: "../../public/fonts/imax-regular-standart.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/imax-bold.otf",
      weight: "700",
    },
  ],
  variable: "--font-imax",
});

export const metadata: Metadata = {
  title: "Motos LS | Distribución Mayorista",
  description: "Potencia tu negocio con la red de distribución de motos más sólida del país.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${imaxStandard.variable} ${poppins.variable} antialiased bg-ls-dark text-ls-light font-sans`}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
