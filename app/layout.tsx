import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aviator Signal Prediction',
  description: 'Predict Aviator game signals with advanced pattern recognition',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
