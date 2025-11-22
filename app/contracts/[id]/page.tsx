/**
 * Contract Details Page
 * 
 * Displays live contract statistics, charts, and events
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, LoadingSpinner, Alert } from '@/components/example-components';
import StatsChart from '@/components/StatsChart';
import EventList from '@/components/EventList';
import { getContractStats, getContractEvents, ContractStats, ContractEvent } from '@/lib/api';
import { saveContract, updateContractTxCount } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import { FaRefresh, FaCopy, FaCheck } from 'react-icons/fa';

export default function ContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const [stats, setStats] = useState<ContractStats | null>(null);
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setAlert(null);

      // Fetch stats and events in parallel
      const [statsResponse, eventsResponse] = await Promise.all([
        getContractStats(contractId),
        getContractEvents(contractId, 50),
      ]);

      if (statsResponse.success && statsResponse.stats) {
        setStats(statsResponse.stats);
        
        // Update contract in localStorage with latest tx count
        updateContractTxCount(
          contractId,
          statsResponse.stats.totalTransactions
        );
        
        // Also save/update contract metadata
        saveContract({
          contractId: contractId,
          contractName: statsResponse.stats.contractName,
          network: statsResponse.stats.network as 'testnet' | 'mainnet',
          lastSeenTxCount: statsResponse.stats.totalTransactions,
        });
      } else {
        setAlert({
          type: 'error',
          message: statsResponse.error || 'Failed to load contract statistics',
        });
      }

      if (eventsResponse.success && eventsResponse.events) {
        setEvents(eventsResponse.events);
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: `Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (contractId) {
      fetchData();
    }
  }, [contractId]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleCopyContractId = async () => {
    await navigator.clipboard.writeText(contractId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">Loading contract statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card title="Contract Not Found">
            <p className="text-gray-600 mb-4">
              Could not load statistics for contract: {contractId}
            </p>
            <Button onClick={() => router.push('/deploy')} variant="primary">
              Deploy a Contract
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Details</h1>
            <p className="text-gray-600">{stats.contractName}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {refreshing ? (
              <>
                <LoadingSpinner />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <FaRefresh />
                <span>Refresh Stats</span>
              </>
            )}
          </button>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Contract Metadata */}
        <Card title="📋 Contract Information">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Contract ID</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-mono text-sm break-all">
                  {contractId}
                </code>
                <button
                  onClick={handleCopyContractId}
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                  title="Copy Contract ID"
                >
                  {copied ? <FaCheck className="text-green-600" /> : <FaCopy />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Contract Name</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                {stats.contractName}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Network</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  stats.network === 'testnet'
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {stats.network.toUpperCase()}
                </span>
              </div>
            </div>

            {stats.accountInfo && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Account Status</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  {stats.accountInfo.exists ? (
                    <span className="text-green-600">✓ Active</span>
                  ) : (
                    <span className="text-red-600">✗ Not Found</span>
                  )}
                  {stats.accountInfo.balance && (
                    <span className="text-gray-600 ml-2">
                      ({stats.accountInfo.balance} XLM)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 my-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Total Transactions</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Total Events</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalEvents}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Average Fee</div>
            <div className="text-3xl font-bold text-gray-900">{parseFloat(stats.averageFee).toFixed(7)}</div>
            <div className="text-gray-500 text-xs mt-1">XLM</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Last Interaction</div>
            <div className="text-lg font-semibold text-gray-900">
              {stats.lastInteraction
                ? format(new Date(stats.lastInteraction), 'MMM dd, HH:mm')
                : 'Never'}
            </div>
            {stats.lastInteraction && (
              <div className="text-gray-500 text-xs mt-1">
                {format(new Date(stats.lastInteraction), 'yyyy')}
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <StatsChart transactions={stats.recentTransactions} />
        </div>

        {/* Events List */}
        <div className="mb-8">
          <EventList events={events} contractId={contractId} />
        </div>

        {/* Recent Transactions */}
        {stats.recentTransactions.length > 0 && (
          <Card title={`📜 Recent Transactions (${stats.recentTransactions.length})`}>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.recentTransactions.map((tx, index) => (
                <div
                  key={tx.id || index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          tx.successful
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {tx.successful ? '✓ Success' : '✗ Failed'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Ledger #{tx.ledger}
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm mb-1">
                        Fee: {parseFloat(tx.fee_charged).toFixed(7)} XLM
                      </div>
                      <div className="text-gray-600 text-sm">
                        Operations: {tx.operation_count}
                      </div>
                    </div>
                    <a
                      href={`https://stellar.expert/explorer/${stats.network}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                    >
                      View →
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <span className="font-mono">{tx.hash.substring(0, 16)}...</span>
                    <span>
                      {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm:ss')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

