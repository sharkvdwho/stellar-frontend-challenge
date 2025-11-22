/**
 * ActivityTimeline Component
 * 
 * Visualizes contract activity in chronological order
 * Shows events and transactions in a timeline format
 */

'use client';

import { ContractEvent, ContractTransaction } from '@/lib/api';
import { format } from 'date-fns';
import { Card } from './example-components';
import { FaCircle, FaExternalLinkAlt } from 'react-icons/fa';

interface ActivityTimelineProps {
  events: ContractEvent[];
  transactions: ContractTransaction[];
}

interface TimelineItem {
  id: string;
  type: 'event' | 'transaction';
  timestamp: string;
  txHash?: string;
  eventType?: string;
  ledger?: number;
  successful?: boolean;
  fee?: string;
  data?: any;
}

export default function ActivityTimeline({ events, transactions }: ActivityTimelineProps) {
  // Combine events and transactions into a single timeline
  const timelineItems: TimelineItem[] = [];

  // Add events to timeline
  events.forEach((event) => {
    timelineItems.push({
      id: event.id || `event-${event.ledger}`,
      type: 'event',
      timestamp: event.timestamp || event.ledgerClosedAt,
      txHash: event.txHash,
      eventType: event.type || 'contract',
      ledger: event.ledger,
      data: event,
    });
  });

  // Add transactions to timeline
  transactions.forEach((tx) => {
    timelineItems.push({
      id: tx.id || tx.hash,
      type: 'transaction',
      timestamp: tx.created_at,
      txHash: tx.hash,
      successful: tx.successful,
      fee: tx.fee_charged,
      ledger: tx.ledger,
      data: tx,
    });
  });

  // Sort by timestamp (most recent first)
  timelineItems.sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA; // Descending order (newest first)
  });

  if (timelineItems.length === 0) {
    return (
      <Card title="📅 Activity Timeline">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-white/60">No activity recorded yet</p>
          <p className="text-white/40 text-sm mt-2">
            Events and transactions will appear here once the contract is used
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`📅 Activity Timeline (${timelineItems.length} items)`}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-violet-500/50" />

        {/* Timeline items */}
        <div className="space-y-6">
          {timelineItems.map((item, index) => {
            const isEvent = item.type === 'event';
            const isSuccess = item.successful !== false;
            const date = new Date(item.timestamp);
            const timeAgo = getTimeAgo(date);

            return (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isEvent
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : isSuccess
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-red-500/20 border-red-500/50'
                    }`}
                  >
                    <FaCircle
                      className={`text-xs ${
                        isEvent
                          ? 'text-purple-400'
                          : isSuccess
                          ? 'text-blue-400'
                          : 'text-red-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {/* Type badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            isEvent
                              ? 'bg-purple-500/20 text-purple-300'
                              : isSuccess
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {isEvent ? '📢 Event' : '💸 Transaction'}
                        </span>
                        {isEvent && item.eventType && (
                          <span className="text-white/80 text-sm font-medium">
                            {item.eventType}
                          </span>
                        )}
                        {!isEvent && (
                          <span
                            className={`text-xs ${
                              isSuccess ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {isSuccess ? '✓ Success' : '✗ Failed'}
                          </span>
                        )}
                      </div>

                      {/* Transaction hash */}
                      {item.txHash && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2">
                            <code className="text-white/60 text-xs font-mono bg-white/5 px-2 py-1 rounded">
                              {item.txHash.substring(0, 16)}...
                            </code>
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-xs transition-colors flex items-center gap-1"
                            >
                              <FaExternalLinkAlt />
                              View TX
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Event topics (if event) */}
                      {isEvent && item.data && (item.data as ContractEvent).topic && (
                        <div className="mb-2">
                          <p className="text-white/60 text-xs mb-1">Topics:</p>
                          <div className="flex flex-wrap gap-1">
                            {(item.data as ContractEvent).topic.slice(0, 3).map((topic, i) => (
                              <span
                                key={i}
                                className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-mono"
                              >
                                {String(topic).substring(0, 20)}
                                {String(topic).length > 20 ? '...' : ''}
                              </span>
                            ))}
                            {(item.data as ContractEvent).topic.length > 3 && (
                              <span className="text-white/40 text-xs">
                                +{(item.data as ContractEvent).topic.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Transaction fee (if transaction) */}
                      {!isEvent && item.fee && (
                        <div className="mb-2">
                          <span className="text-white/60 text-xs">Fee: </span>
                          <span className="text-white/80 text-xs font-semibold">
                            {parseFloat(item.fee).toFixed(7)} XLM
                          </span>
                        </div>
                      )}

                      {/* Ledger */}
                      {item.ledger && (
                        <div className="mb-2">
                          <span className="text-white/60 text-xs">Ledger: </span>
                          <span className="text-white/80 text-xs font-semibold">
                            #{item.ledger}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-white/80 text-sm font-semibold">
                        {format(date, 'MMM dd, HH:mm')}
                      </div>
                      <div className="text-white/50 text-xs mt-1">{timeAgo}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return format(date, 'MMM dd, yyyy');
  }
}

