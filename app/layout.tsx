import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstroDeploy - Smart Contract Platform',
  description: 'Auto-deploy and analyze Soroban smart contracts on Stellar blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}