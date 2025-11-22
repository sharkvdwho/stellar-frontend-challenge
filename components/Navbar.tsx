/**
 * Shared Navbar Component
 * 
 * Displays navigation tabs on all pages with active tab highlighting
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/useWallet';
import { FaWallet, FaCopy, FaCheck, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';

export default function Navbar() {
  const pathname = usePathname();
  const { publicKey, isConnected, loading, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error: any) {
      alert(`Failed to connect wallet:\n${error.message}`);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/deploy', label: 'Deploy' },
    { href: '/my-contracts', label: 'My Contracts' },
    { href: '/templates', label: 'Templates' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AstroDeploy</h1>
              <p className="text-gray-500 text-xs">Smart Contract Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {!isConnected ? (
              <button
                onClick={handleConnectWallet}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <FaWallet className="text-xs" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <code className="text-gray-700 text-xs font-mono">
                    {stellar.formatAddress(publicKey, 6, 4)}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy address"
                  >
                    {copied ? <FaCheck className="text-green-500 text-xs" /> : <FaCopy className="text-xs" />}
                  </button>
                </div>
                <button
                  onClick={disconnect}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Disconnect wallet"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 mt-4 pt-4 border-t border-gray-200 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive(link.href)
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}


