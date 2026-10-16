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
  metadataBase: new URL('https://lsmotos.com'),
  title: {
    default: "Motos LS | Distribución Mayorista de Motos",
    template: "%s | Motos LS",
  },
  description: "Potencia tu negocio con la red de distribución de motos más sólida del país.",
  applicationName: "Motos LS",
  keywords: ["motos LS", "motos por mayor", "distribuidor de motos", "motos mayorista Argentina", "concesionarios de motos", "reventa de motos"],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel to verify ownership in Search Console
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: "/images/LOGO1.png",
    shortcut: "/images/LOGO1.png",
    apple: "/images/LOGO1.png",
  },
  openGraph: {
    title: "Motos LS | Distribución Mayorista",
    description: "Potencia tu negocio con la red de distribución de motos más sólida del país. Stock estable y márgenes competitivos.",
    siteName: "Motos LS",
    url: "/",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Motos LS",
  url: "https://lsmotos.com",
  logo: "https://lsmotos.com/images/LOGO1.png",
  description: "Distribución mayorista de motos para concesionarios y revendedores de todo el país.",
  areaServed: "AR",
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5XMSKTZH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
