import type { Metadata } from 'next';
import { getProducts } from '@/actions/productActions';
import CatalogClient from './CatalogClient';

// Re-render the catalog at most once per hour so Google always gets fresh HTML
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Catálogo de motos',
  description:
    'Catálogo mayorista de motos LS: modelos y marcas disponibles para concesionarios y revendedores en todo el país.',
  alternates: { canonical: '/catalogo' },
  openGraph: {
    title: 'Catálogo de motos | Motos LS',
    description: 'Modelos y marcas disponibles para distribuidores y revendedores.',
    url: '/catalogo',
  },
};

export default async function CatalogPage() {
  let products = [];
  try {
    products = await getProducts();
  } catch (error) {
    // If the DB is unreachable the client component falls back to fetching on its own
    console.error(error);
  }

  return <CatalogClient initialProducts={products} />;
}
