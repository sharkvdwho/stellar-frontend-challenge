/**
 * My Contracts Page
 * 
 * SaaS-style page displaying deployed contracts stored in localStorage
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadContracts, StoredContract, removeContract, initializeMockContracts } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import { FaTrash, FaArrowRight, FaCopy, FaCheck, FaNetworkWired, FaRocket } from 'react-icons/fa';
import { format } from 'date-fns';

export default function MyContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<StoredContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with mock data if no contracts exist
    initializeMockContracts();
    loadContractsData();
  }, []);

  const loadContractsData = () => {
    try {
      const storedContracts = loadContracts();
      const sorted = storedContracts.sort((a, b) => {
        const dateA = new Date(a.lastUpdated || a.deployedAt).getTime();
        const dateB = new Date(b.lastUpdated || b.deployedAt).getTime();
        return dateB - dateA;
      });
      setContracts(sorted);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveContract = (contractId: string) => {
    if (confirm(`Remove contract ${contractId.substring(0, 16)}... from your list?`)) {
      removeContract(contractId);
      loadContractsData();
    }
  };

  const handleCopyContractId = async (contractId: string) => {
    await navigator.clipboard.writeText(contractId);
    setCopiedId(contractId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewAnalytics = (contractId: string) => {
    router.push(`/contracts/${contractId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {contracts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaNetworkWired className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Contracts Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Deploy your first Soroban contract to get started with smart contract deployment and analytics.
            </p>
            <Link
              href="/deploy"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              <FaRocket />
              <span>Deploy Your First Contract</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">My Contracts</h2>
              <p className="text-gray-600">
                {contracts.length} contract{contracts.length !== 1 ? 's' : ''} stored locally
              </p>
            </div>

            <div className="grid gap-6">
              {contracts.map((contract) => (
                <div
                  key={contract.contractId}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      {/* Contract ID */}
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Contract Address
                        </label>
                        <div className="flex items-center gap-3">
                          <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-mono text-sm break-all">
                            {contract.contractId}
                          </code>
                          <button
                            onClick={() => handleCopyContractId(contract.contractId)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                              copiedId === contract.contractId
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            }`}
                            title="Copy Contract ID"
                          >
                            {copiedId === contract.contractId ? (
                              <FaCheck className="text-green-600 text-sm" />
                            ) : (
                              <FaCopy className="text-gray-600 text-sm" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Contract Info Grid */}
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {contract.contractName && (
                          <div>
                            <label className="block text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">
                              Name
                            </label>
                            <p className="text-gray-900 font-semibold text-lg">
                              {contract.contractName}
                            </p>
                          </div>
                        )}

                        {contract.network && (
                          <div>
                            <label className="block text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">
                              Network
                            </label>
                            <span
                              className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                contract.network === 'testnet'
                                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                  : 'bg-green-50 text-green-700 border border-green-200'
                              }`}
                            >
                              {contract.network.toUpperCase()}
                            </span>
                          </div>
                        )}

                        <div>
                          <label className="block text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">
                            Transactions
                          </label>
                          <p className="text-gray-900 font-semibold text-lg">
                            {contract.lastSeenTxCount !== undefined
                              ? contract.lastSeenTxCount
                              : '—'}
                          </p>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="flex gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div>
                          <span className="font-medium">Deployed: </span>
                          {format(new Date(contract.deployedAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                        {contract.lastUpdated && (
                          <div>
                            <span className="font-medium">Updated: </span>
                            {format(new Date(contract.lastUpdated), 'MMM dd, yyyy HH:mm')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleViewAnalytics(contract.contractId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                      >
                        <FaArrowRight className="text-sm" />
                        <span>View Analytics</span>
                      </button>
                      <button
                        onClick={() => handleRemoveContract(contract.contractId)}
                        className="bg-white hover:bg-gray-50 text-red-600 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-red-200 hover:border-red-300 whitespace-nowrap"
                      >
                        <FaTrash className="text-sm" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">ℹ️</span>
                About Local Storage
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Contracts are stored in your browser's localStorage</li>
                <li>• Data is only stored on your device (not synced)</li>
                <li>• Clearing browser data will remove your contracts list</li>
                <li>• Transaction counts update when you view the dashboard</li>
              </ul>
            </div>
          </>
        )}
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
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/deploy" className="hover:text-gray-900 transition-colors">Deploy</Link>
              <Link href="/templates" className="hover:text-gray-900 transition-colors">Templates</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
