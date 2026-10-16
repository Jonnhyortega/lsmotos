import type { Metadata } from 'next';

// Alternative designs of the home page: keep them out of Google to avoid duplicate content
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

export default function LandingOptionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
