import type { Metadata } from 'next';

// Thank-you page shown after the contact form: useful for conversion tracking, not for search results
export const metadata: Metadata = {
  title: '¡Gracias por contactarnos!',
  robots: { index: false, follow: true },
};

export default function ContactThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
