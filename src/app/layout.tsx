import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitForge Fitness Hub',
  description: 'AI-powered comprehensive fitness platform with personal training, workout library, and e-commerce store',
  keywords: 'fitness, workout, AI trainer, nutrition, supplements, equipment',
  authors: [{ name: 'FitForge Team' }],
  openGraph: {
    title: 'FitForge Fitness Hub',
    description: 'Transform your fitness journey with AI-powered guidance',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
