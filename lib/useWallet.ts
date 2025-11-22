/**
 * useWallet Hook
 * 
 * Shared hook for managing wallet connection state across pages
 * Persists connection state in localStorage
 */

import { useState, useEffect } from 'react';
import { stellar } from './stellar-helper';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);

  // Restore wallet connection on mount
  useEffect(() => {
    const restoreWallet = async () => {
      try {
        setRestoring(true);
        const savedAddress = stellar.getSavedAddress();
        if (savedAddress && stellar.isSavedConnection()) {
          // Try to restore connection
          const address = await stellar.restoreConnection();
          if (address) {
            setPublicKey(address);
            setIsConnected(true);
          } else {
            // If restore failed, clear saved state
            stellar.clearSavedConnection();
          }
        }
      } catch (error) {
        console.error('Failed to restore wallet connection:', error);
        stellar.clearSavedConnection();
      } finally {
        setRestoring(false);
      }
    };

    restoreWallet();
  }, []);

  const connect = async () => {
    try {
      setLoading(true);
      const key = await stellar.connectWallet();
      setPublicKey(key);
      setIsConnected(true);
      return key;
    } catch (error: any) {
      console.error('Connection error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    stellar.disconnect();
    setPublicKey('');
    setIsConnected(false);
  };

  return {
    publicKey,
    isConnected,
    loading,
    restoring,
    connect,
    disconnect,
  };
}

