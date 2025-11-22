/**
 * AstroDeploy - Main Page
 * 
 * SaaS-style landing page for auto-deploying smart contracts and analytics
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { loadContracts, initializeMockContracts } from '@/lib/storage';
import { useWallet } from '@/lib/useWallet';
import { 
  FaRocket, 
  FaChartLine, 
  FaCode, 
  FaBolt, 
  FaArrowRight,
  FaNetworkWired,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaPlay,
  FaWallet,
  FaCopy,
  FaCheck
} from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [contractCount, setContractCount] = useState(0);
  const [recentContracts, setRecentContracts] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  
  const { publicKey, isConnected, loading, connect, disconnect } = useWallet();

  useEffect(() => {
    // Initialize with mock data if no contracts exist
    initializeMockContracts();
    const contracts = loadContracts();
    setContractCount(contracts.length);
    setRecentContracts(contracts.slice(0, 3));
  }, []);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error: any) {
      alert(`Failed to connect wallet:\n${error.message}`);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Banner */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <FaBolt className="text-blue-600 text-xs" />
            <span className="text-blue-700 text-xs font-semibold">Auto-Deploy Smart Contracts</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Deploy & Analyze
            <br />
            <span className="text-blue-600">Soroban Contracts</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            One-click deployment with real-time analytics. Build, deploy, and monitor your Soroban smart contracts effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isConnected && (
              <button
                onClick={handleConnectWallet}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <FaWallet className="text-base" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
            
            <Link
              href="/deploy"
              className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
            >
              <FaRocket className="text-base" />
              <span>Deploy Contract</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/my-contracts"
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 shadow-sm"
            >
              <FaChartLine className="text-base" />
              <span>View Analytics</span>
            </Link>
          </div>

          {/* Connected Wallet Info */}
          {isConnected && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 text-sm font-medium">Connected:</span>
                <code className="text-gray-900 text-sm font-mono">
                  {publicKey.substring(0, 8)}...{publicKey.substring(publicKey.length - 6)}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="text-gray-500 hover:text-gray-700 transition-colors ml-2"
                  title="Copy address"
                >
                  {copied ? (
                    <FaCheck className="text-green-600 text-sm" />
                  ) : (
                    <FaCopy className="text-sm" />
                  )}
                </button>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <FaRocket className="text-blue-600 text-xl" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{contractCount}</div>
            <div className="text-gray-600 text-base font-medium">Contracts Deployed</div>
            <div className="text-gray-500 text-sm mt-2">+2 this week</div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
              <FaChartLine className="text-indigo-600 text-xl" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">449</div>
            <div className="text-gray-600 text-base font-medium">Total Transactions</div>
            <div className="text-gray-500 text-sm mt-2">Across all contracts</div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <FaBolt className="text-green-600 text-xl" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">0.00005</div>
            <div className="text-gray-600 text-base font-medium">Avg Fee (XLM)</div>
            <div className="text-gray-500 text-sm mt-2">Per transaction</div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
              <FaNetworkWired className="text-purple-600 text-xl" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">99.9%</div>
            <div className="text-gray-600 text-base font-medium">Uptime</div>
            <div className="text-gray-500 text-sm mt-2">Network reliability</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Powerful features to deploy and monitor your smart contracts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <FaCode className="text-blue-600 text-lg" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">One-Click Deploy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Deploy Soroban contracts instantly with automatic compilation and deployment
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <FaChartLine className="text-indigo-600 text-lg" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Live Analytics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-time statistics, transaction tracking, and event monitoring
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <FaNetworkWired className="text-green-600 text-lg" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Stellar Network</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built on Stellar's fast, low-cost blockchain infrastructure
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <FaShieldAlt className="text-purple-600 text-lg" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enterprise-grade security with encrypted deployments
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                <FaClock className="text-orange-600 text-lg" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Auto-Refresh</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Automatic updates every 10 seconds for real-time monitoring
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                <FaCheckCircle className="text-teal-600 text-lg" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Easy Tracking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track all your deployments with localStorage persistence
              </p>
            </div>
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Contracts</h2>
              <p className="text-gray-600">Your latest deployments</p>
            </div>
            {recentContracts.length > 0 && (
              <Link
                href="/my-contracts"
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2"
              >
                View All
                <FaArrowRight className="text-xs" />
              </Link>
            )}
          </div>
          
          {recentContracts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recentContracts.map((contract) => (
                <Link
                  key={contract.contractId}
                  href={`/contract-analytics/${contract.contractId}`}
                  className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FaNetworkWired className="text-blue-600" />
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">
                    {contract.contractName || 'Contract'}
                  </h3>
                  <code className="text-gray-500 text-xs font-mono block truncate mb-3">
                    {contract.contractId.substring(0, 24)}...
                  </code>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      contract.network === 'testnet'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {contract.network?.toUpperCase() || 'TESTNET'}
                    </span>
                    {contract.lastSeenTxCount !== undefined && (
                      <span className="text-gray-500 text-xs">
                        {contract.lastSeenTxCount} tx
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaNetworkWired className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contracts Yet</h3>
              <p className="text-gray-600 mb-6">Deploy your first contract to get started</p>
              <Link
                href="/deploy"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                <FaRocket />
                <span>Deploy Your First Contract</span>
              </Link>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Deploy?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Start deploying your Soroban smart contracts in seconds. No complex setup required.
          </p>
          <Link
            href="/deploy"
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg"
          >
            <FaPlay className="text-base" />
            <span>Deploy Your First Contract</span>
            <FaArrowRight />
          </Link>
        </div>
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="text-gray-900 font-semibold">AstroDeploy</span>
              </div>
              <p className="text-gray-500 text-sm">Smart Contract Platform on Stellar Testnet</p>
            </div>
            <div className="flex items-center gap-8 text-gray-600 text-sm">
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                Stellar.org
              </a>
              <a href="https://soroban.stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                Soroban Docs
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 AstroDeploy. Built on Stellar Testnet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
