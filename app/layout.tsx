import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AssistantWidget from '@/components/AssistantWidget';

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: 'AI Tools HuB — Premium AI Subscriptions & Tools',
    template: '%s · AI Tools HuB',
  },
  description:
    'Buy premium AI subscriptions, video editing tools, design tools, VPN and learning plans at discounted prices in Pakistan — with replacement warranty, instant WhatsApp support and Easypaisa / Binance payments.',
  keywords: [
    'AI Tools Hub',
    'AI subscriptions Pakistan',
    'Gemini Pro',
    'ChatGPT Plus',
    'CapCut Pro',
    'Muse AI',
    'Figma',
    'Udemy',
    'NordVPN',
    'Surfshark',
  ],
  icons: { icon: '/favicon.png' },
  openGraph: {
    type: 'website',
    siteName: 'AI Tools HuB',
    title: 'AI Tools HuB — Premium AI Subscriptions & Tools',
    description:
      'Premium AI subscriptions, video editing tools, design tools, VPN and learning plans at discounted prices — with replacement warranty and WhatsApp support.',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'AI Tools HuB' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools HuB — Premium AI Subscriptions & Tools',
    description:
      'Premium AI subscriptions, video editing tools, design tools, VPN and learning plans at discounted prices.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#04071a] text-slate-100 antialiased">
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <AssistantWidget />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
