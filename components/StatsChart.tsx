/**
 * StatsChart Component
 * 
 * Displays charts for contract analytics:
 * - Line chart of transactions over time
 * - Bar chart of events
 */

'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ContractTransaction, ContractEvent } from '@/lib/api';
import { format, parseISO, subDays } from 'date-fns';

interface StatsChartProps {
  transactions: ContractTransaction[];
  events?: ContractEvent[];
  chartType?: 'line' | 'bar';
}

interface ChartDataPoint {
  date: string;
  count: number;
  label: string;
}

interface EventChartDataPoint {
  type: string;
  count: number;
}

export default function StatsChart({ transactions, events, chartType = 'line' }: StatsChartProps) {
  // Process transactions into time series data
  const processTransactionData = (): ChartDataPoint[] => {
    if (transactions.length === 0) {
      return [];
    }

    // Group transactions by date
    const transactionsByDate = new Map<string, number>();

    transactions.forEach((tx) => {
      const date = parseISO(tx.created_at);
      const dateKey = format(date, 'yyyy-MM-dd');
      transactionsByDate.set(dateKey, (transactionsByDate.get(dateKey) || 0) + 1);
    });

    // Get date range (last 30 days or all available dates)
    const dates = Array.from(transactionsByDate.keys()).sort();
    const startDate = dates.length > 0 ? parseISO(dates[0]) : new Date();
    const endDate = new Date();
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 24));
    const daysToShow = Math.min(daysDiff, 30);

    // Create data points for the last N days
    const dataPoints: ChartDataPoint[] = [];
    for (let i = daysToShow; i >= 0; i--) {
      const date = subDays(endDate, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const count = transactionsByDate.get(dateKey) || 0;
      
      dataPoints.push({
        date: dateKey,
        count,
        label: format(date, 'MMM dd'),
      });
    }

    return dataPoints;
  };

  // Process events into bar chart data
  const processEventData = (): EventChartDataPoint[] => {
    if (!events || events.length === 0) {
      return [];
    }

    // Group events by type
    const eventsByType = new Map<string, number>();

    events.forEach((event) => {
      const type = event.type || 'contract';
      eventsByType.set(type, (eventsByType.get(type) || 0) + 1);
    });

    // Convert to array
    return Array.from(eventsByType.entries()).map(([type, count]) => ({
      type: type.length > 20 ? type.substring(0, 20) + '...' : type,
      count,
    }));
  };

  const transactionData = processTransactionData();
  const eventData = processEventData();

  if (chartType === 'bar' && eventData.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-white/60">No event data available</p>
        <p className="text-white/40 text-sm mt-2">Events will appear here once the contract emits them</p>
      </div>
    );
  }

  if (chartType === 'line' && transactionData.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-white/60">No transaction data available</p>
        <p className="text-white/40 text-sm mt-2">Transactions will appear here once the contract is used</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">
        {chartType === 'line' ? 'Transaction Count Over Time' : 'Events by Type'}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={transactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="label"
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend
              wrapperStyle={{ color: 'rgba(255, 255, 255, 0.8)' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Transactions"
            />
          </LineChart>
        ) : (
          <BarChart data={eventData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="type"
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend
              wrapperStyle={{ color: 'rgba(255, 255, 255, 0.8)' }}
            />
            <Bar
              dataKey="count"
              fill="#8b5cf6"
              name="Events"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
