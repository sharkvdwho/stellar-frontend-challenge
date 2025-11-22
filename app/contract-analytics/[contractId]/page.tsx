/**
 * Contract Analytics Page
 * 
 * Modern Web3-style analytics dashboard for deployed contracts
 * Shows statistics, charts, and event lists with real-time updates
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, LoadingSpinner, Alert } from '@/components/example-components';
import StatsChart from '@/components/StatsChart';
import EventList from '@/components/EventList';
import ActivityTimeline from '@/components/ActivityTimeline';
import { getContractStats, ContractStats, ContractTransaction, ContractEvent } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import { 
  FaSync, 
  FaCopy, 
  FaCheck, 
  FaChartLine, 
  FaBolt, 
  FaCoins, 
  FaClock,
  FaNetworkWired
} from 'react-icons/fa';

export default function ContractAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;

  const [stats, setStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const fetchStats = async (showRefreshing = false, silent = false) => {
    if (refreshing && !showRefreshing) {
      return;
    }

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else if (!silent) {
        setLoading(true);
      }
      if (!silent) {
        setAlert(null);
      }

      const response = await getContractStats(contractId);

      if (response.success && response.stats) {
        const normalizedStats: ContractStats = {
          ...response.stats,
          totalTransactions: response.stats.totalTx || response.stats.totalTransactions || 0,
          totalEvents: response.stats.totalEvents || 0,
          averageFee: response.stats.avgFee || response.stats.averageFee || '0',
          lastInteraction: response.stats.lastActivity || response.stats.lastInteraction || null,
          recentTransactions: response.stats.transactions || response.stats.recentTransactions || [],
        };
        setStats(normalizedStats);
      } else {
        if (!silent) {
          setAlert({
            type: 'error',
            message: response.error || 'Failed to load contract statistics',
          });
        }
      }
    } catch (error: any) {
      if (!silent) {
        setAlert({
          type: 'error',
          message: `Error: ${error.message}`,
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (contractId) {
      fetchStats();
    }
  }, [contractId]);

  useEffect(() => {
    if (!contractId || !autoRefreshEnabled) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchStats(false, true);
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [contractId, autoRefreshEnabled, refreshing]);

  const handleRefresh = () => {
    fetchStats(true);
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
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
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaNetworkWired className="text-4xl text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contract Not Found</h2>
              <p className="text-gray-600 mb-6">Could not load analytics for this contract</p>
              <Button onClick={() => router.push('/deploy')} variant="primary">
                Deploy a Contract
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const events: ContractEvent[] = (stats as any).events || [];
  const totalTx = stats.totalTx || stats.totalTransactions || 0;
  const totalEvents = stats.totalEvents || 0;
  const avgFee = stats.avgFee || stats.averageFee || '0';
  const lastActivity = stats.lastActivity || stats.lastInteraction || null;
  const transactions = stats.transactions || stats.recentTransactions || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header with Actions */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Analytics</h1>
            <p className="text-gray-600">{stats.contractName || 'Smart Contract'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAutoRefresh}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                autoRefreshEnabled
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span>Auto</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {refreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <FaSync />
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>

        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Contract ID */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FaNetworkWired className="text-blue-600 text-xl" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold">Contract Address</label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-gray-900 font-mono text-sm break-all">
                {contractId}
              </code>
              <button
                onClick={handleCopyContractId}
                className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                  copied
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
                title="Copy"
              >
                {copied ? (
                  <FaCheck className="text-green-600 text-lg" />
                ) : (
                  <FaCopy className="text-gray-600 text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{totalTx.toLocaleString()}</div>
            <div className="text-gray-600 text-sm">Transactions</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaBolt className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{totalEvents.toLocaleString()}</div>
            <div className="text-gray-600 text-sm">Events</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaCoins className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{parseFloat(avgFee).toFixed(7)}</div>
            <div className="text-gray-600 text-sm">Avg Fee (XLM)</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <FaClock className="text-orange-600 text-xl" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {lastActivity
                ? format(new Date(lastActivity), 'MMM dd, HH:mm')
                : 'Never'}
            </div>
            <div className="text-gray-600 text-sm">Last Activity</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <StatsChart
            transactions={transactions}
            chartType="line"
          />
          <StatsChart
            transactions={[]}
            events={events}
            chartType="bar"
          />
        </div>

        {/* Activity Timeline */}
        <div className="mb-8">
          <ActivityTimeline events={events} transactions={transactions} />
        </div>

        {/* Event List */}
        <div className="mb-8">
          <EventList events={events} contractId={contractId} />
        </div>
      </main>
    </div>
  );
}
