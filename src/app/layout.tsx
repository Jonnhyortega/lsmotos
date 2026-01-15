import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins, Raleway } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";



const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const imaxStandard = localFont({
  src: [
    {
      path: "../../public/fonts/imax-regular-standart.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/imax-light.otf",
      weight: "300",
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
  icons: {
    icon: "/images/LOGO1.png",
    shortcut: "/images/LOGO1.png",
    apple: "/images/LOGO1.png",
  },
  openGraph: {
    title: "Motos LS | Distribución Mayorista",
    description: "Potencia tu negocio con la red de distribución de motos más sólida del país. Stock estable y márgenes competitivos.",
    siteName: "Motos LS",
    images: [
      {
        url: "/images/LOGO1.png",
        width: 800,
        height: 600,
        alt: "Logo Motos LS",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motos LS | Distribución Mayorista",
    description: "Potencia tu negocio con la red de distribución de motos más sólida del país.",
    images: ["/images/LOGO1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5XMSKTZH');`,
          }}
        />
      </head>
      <body className={`${imaxStandard.variable} ${poppins.variable} ${raleway.variable} antialiased bg-ls-dark text-ls-light font-sans`}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
