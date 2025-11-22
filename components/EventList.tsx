/**
 * EventList Component
 * 
 * Displays contract events in a table format
 */

'use client';

import { ContractEvent } from '@/lib/api';
import { format } from 'date-fns';
import { Card } from './example-components';

interface EventListProps {
  events: ContractEvent[];
  contractId: string;
}

export default function EventList({ events, contractId }: EventListProps) {
  if (events.length === 0) {
    return (
      <Card title="📢 Events">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-white/60">No events emitted yet</p>
          <p className="text-white/40 text-sm mt-2">Events will appear here when the contract emits them</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`📢 Events (${events.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Type</th>
              <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Topics</th>
              <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Value</th>
              <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Ledger</th>
              <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Timestamp</th>
              <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id || index}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="text-blue-400 font-semibold text-sm">
                    {event.type || 'contract'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {event.topic && event.topic.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {event.topic.slice(0, 2).map((topic, i) => (
                        <span
                          key={i}
                          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-mono"
                        >
                          {String(topic).substring(0, 15)}
                          {String(topic).length > 15 ? '...' : ''}
                        </span>
                      ))}
                      {event.topic.length > 2 && (
                        <span className="text-white/40 text-xs">+{event.topic.length - 2} more</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-white/40 text-xs">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {event.value ? (
                    <code className="text-white/80 text-xs bg-white/5 px-2 py-1 rounded max-w-xs truncate block">
                      {typeof event.value === 'string'
                        ? event.value.substring(0, 30)
                        : JSON.stringify(event.value).substring(0, 30)}
                      {(typeof event.value === 'string' ? event.value.length : JSON.stringify(event.value).length) > 30 ? '...' : ''}
                    </code>
                  ) : (
                    <span className="text-white/40 text-xs">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-white/60 text-sm">
                    #{event.ledger}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-white/60 text-sm">
                    {format(new Date(event.timestamp || event.ledgerClosedAt), 'MMM dd, HH:mm')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {event.txHash ? (
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      View →
                    </a>
                  ) : (
                    <span className="text-white/40 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
