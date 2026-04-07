import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Client Nurture OS',
  description: 'Relationship Intelligence Platform for agencies and B2B businesses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0F1117] text-[#F1F5F9] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
