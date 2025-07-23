import { useState, useEffect, useCallback } from 'react';

interface HistoryEntry {
  id: string;
  ibans: string[];
  country: string;
  bank?: string;
  timestamp: number;
  quantity: number;
}

const HISTORY_KEY = 'iban-generator-history';
const MAX_HISTORY_ENTRIES = 50;

export function useIBANHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from session storage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load IBAN history:', error);
    }
  }, []);

  // Save history to session storage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save IBAN history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((ibans: string[], country: string, bank?: string) => {
    const entry: HistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ibans,
      country,
      bank,
      timestamp: Date.now(),
      quantity: ibans.length
    };

    setHistory(prev => {
      const newHistory = [entry, ...prev];
      // Limit history size
      return newHistory.slice(0, MAX_HISTORY_ENTRIES);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      sessionStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.warn('Failed to clear IBAN history:', error);
    }
  }, []);

  const getHistoryById = useCallback((id: string): HistoryEntry | undefined => {
    return history.find(entry => entry.id === id);
  }, [history]);

  const exportHistory = useCallback(() => {
    const data = history.map(entry => ({
      timestamp: new Date(entry.timestamp).toISOString(),
      country: entry.country,
      bank: entry.bank || 'Random',
      quantity: entry.quantity,
      ibans: entry.ibans
    }));

    return {
      exportDate: new Date().toISOString(),
      totalEntries: history.length,
      entries: data
    };
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryById,
    exportHistory
  };
}