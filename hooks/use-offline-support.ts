/**
 * Offline Support and Network Detection
 * 
 * Provides offline detection, caching, and graceful degradation
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface OfflineData {
  quotes: any[];
  customers: any[];
  companies: any[];
  lastSync: number;
}

export interface QueuedAction {
  id: string;
  type: 'CREATE_QUOTE' | 'UPDATE_QUOTE' | 'DELETE_QUOTE' | 'CREATE_CUSTOMER' | 'UPDATE_CUSTOMER';
  data: any;
  timestamp: number;
  retryCount: number;
}

export function useOfflineSupport() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  });

  const [offlineData, setOfflineData] = useState<OfflineData>({
    quotes: [],
    customers: [],
    companies: [],
    lastSync: 0
  });

  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncInterval = useRef<NodeJS.Timeout>();

  /**
   * Update network status
   */
  const updateNetworkStatus = useCallback(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    setNetworkStatus({
      isOnline: navigator.onLine,
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false
    });
  }, []);

  /**
   * Load offline data from localStorage
   */
  const loadOfflineData = useCallback(() => {
    try {
      const stored = localStorage.getItem('offline-data');
      if (stored) {
        const data = JSON.parse(stored);
        setOfflineData(data);
      }

      const storedQueue = localStorage.getItem('action-queue');
      if (storedQueue) {
        const queue = JSON.parse(storedQueue);
        setQueuedActions(queue);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }, []);

  /**
   * Save data to offline storage
   */
  const saveOfflineData = useCallback((data: Partial<OfflineData>) => {
    try {
      const currentData = { ...offlineData, ...data, lastSync: Date.now() };
      localStorage.setItem('offline-data', JSON.stringify(currentData));
      setOfflineData(currentData);
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }, [offlineData]);

  /**
   * Queue action for when back online
   */
  const queueAction = useCallback((action: Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>) => {
    const queuedAction: QueuedAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      ...action
    };

    const newQueue = [...queuedActions, queuedAction];
    setQueuedActions(newQueue);
    localStorage.setItem('action-queue', JSON.stringify(newQueue));

    return queuedAction.id;
  }, [queuedActions]);

  /**
   * Process queued actions when back online
   */
  const processQueuedActions = useCallback(async () => {
    if (!networkStatus.isOnline || queuedActions.length === 0) {
      return;
    }

    setIsSyncing(true);
    const processedActions: string[] = [];
    const failedActions: QueuedAction[] = [];

    for (const action of queuedActions) {
      try {
        await executeQueuedAction(action);
        processedActions.push(action.id);
      } catch (error) {
        console.error('Failed to process queued action:', error);
        
        // Retry logic
        if (action.retryCount < 3) {
          failedActions.push({
            ...action,
            retryCount: action.retryCount + 1
          });
        } else {
          console.error('Max retries exceeded for action:', action);
        }
      }
    }

    // Update queue with only failed actions
    const newQueue = failedActions;
    setQueuedActions(newQueue);
    localStorage.setItem('action-queue', JSON.stringify(newQueue));

    setIsSyncing(false);
  }, [networkStatus.isOnline, queuedActions]);

  /**
   * Execute a queued action
   */
  const executeQueuedAction = async (action: QueuedAction) => {
    const baseUrl = '/api';
    
    switch (action.type) {
      case 'CREATE_QUOTE':
        await fetch(`${baseUrl}/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
        
      case 'UPDATE_QUOTE':
        await fetch(`${baseUrl}/quotes/${action.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
        
      case 'DELETE_QUOTE':
        await fetch(`${baseUrl}/quotes/${action.data.id}`, {
          method: 'DELETE'
        });
        break;
        
      case 'CREATE_CUSTOMER':
        await fetch(`${baseUrl}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
        
      case 'UPDATE_CUSTOMER':
        await fetch(`${baseUrl}/customers/${action.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  /**
   * Sync data with server
   */
  const syncWithServer = useCallback(async () => {
    if (!networkStatus.isOnline) {
      return;
    }

    try {
      setIsSyncing(true);

      // Fetch latest data from server
      const [quotesRes, customersRes, companiesRes] = await Promise.all([
        fetch('/api/quotes'),
        fetch('/api/customers'),
        fetch('/api/companies')
      ]);

      const [quotes, customers, companies] = await Promise.all([
        quotesRes.json(),
        customersRes.json(),
        companiesRes.json()
      ]);

      // Save to offline storage
      saveOfflineData({
        quotes: quotes.data || [],
        customers: customers.data || [],
        companies: companies.data || []
      });

      // Process any queued actions
      await processQueuedActions();

    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [networkStatus.isOnline, saveOfflineData, processQueuedActions]);

  /**
   * Get cached data or fetch from server
   */
  const getData = useCallback(async <T>(
    endpoint: string,
    cacheKey: keyof OfflineData
  ): Promise<T> => {
    if (networkStatus.isOnline) {
      try {
        const response = await fetch(`/api/${endpoint}`);
        const data = await response.json();
        
        // Update cache
        saveOfflineData({ [cacheKey]: data.data || data });
        
        return data;
      } catch (error) {
        console.error('Failed to fetch from server, using cache:', error);
      }
    }

    // Return cached data
    return offlineData[cacheKey] as T;
  }, [networkStatus.isOnline, offlineData, saveOfflineData]);

  /**
   * Create quote (online or offline)
   */
  const createQuote = useCallback(async (quoteData: any) => {
    if (networkStatus.isOnline) {
      try {
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quoteData)
        });
        
        if (response.ok) {
          const result = await response.json();
          // Update cache
          const newQuotes = [...offlineData.quotes, result.data];
          saveOfflineData({ quotes: newQuotes });
          return result;
        }
      } catch (error) {
        console.error('Failed to create quote online:', error);
      }
    }

    // Queue for later or create offline
    const offlineQuote = {
      ...quoteData,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      status: 'draft_offline'
    };

    queueAction({
      type: 'CREATE_QUOTE',
      data: quoteData
    });

    // Add to local cache
    const newQuotes = [...offlineData.quotes, offlineQuote];
    saveOfflineData({ quotes: newQuotes });

    return { success: true, data: offlineQuote, offline: true };
  }, [networkStatus.isOnline, offlineData.quotes, saveOfflineData, queueAction]);

  /**
   * Update quote (online or offline)
   */
  const updateQuote = useCallback(async (id: string, updates: any) => {
    if (networkStatus.isOnline && !id.startsWith('offline_')) {
      try {
        const response = await fetch(`/api/quotes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        
        if (response.ok) {
          const result = await response.json();
          // Update cache
          const newQuotes = offlineData.quotes.map(q => 
            q.id === id ? { ...q, ...result.data } : q
          );
          saveOfflineData({ quotes: newQuotes });
          return result;
        }
      } catch (error) {
        console.error('Failed to update quote online:', error);
      }
    }

    // Queue for later or update offline
    queueAction({
      type: 'UPDATE_QUOTE',
      data: { id, ...updates }
    });

    // Update local cache
    const newQuotes = offlineData.quotes.map(q => 
      q.id === id ? { ...q, ...updates, updated_at: new Date().toISOString() } : q
    );
    saveOfflineData({ quotes: newQuotes });

    return { success: true, offline: true };
  }, [networkStatus.isOnline, offlineData.quotes, saveOfflineData, queueAction]);

  /**
   * Initialize offline support
   */
  useEffect(() => {
    updateNetworkStatus();
    loadOfflineData();

    // Listen for network changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [updateNetworkStatus, loadOfflineData]);

  /**
   * Set up periodic sync when online
   */
  useEffect(() => {
    if (networkStatus.isOnline) {
      syncWithServer();
      
      // Set up periodic sync every 5 minutes
      syncInterval.current = setInterval(syncWithServer, 5 * 60 * 1000);
    } else {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
      }
    }

    return () => {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
      }
    };
  }, [networkStatus.isOnline, syncWithServer]);

  return {
    networkStatus,
    offlineData,
    queuedActions,
    isSyncing,
    getData,
    createQuote,
    updateQuote,
    syncWithServer,
    queueAction,
    isOfflineCapable: true
  };
}

/**
 * Hook for connection-aware API requests
 */
export function useConnectionAware() {
  const { networkStatus } = useOfflineSupport();

  const fetchWithRetry = useCallback(async (
    url: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<Response> => {
    const controller = new AbortController();
    
    // Adjust timeout based on connection quality
    const timeout = networkStatus.effectiveType === 'slow-2g' ? 30000 :
                   networkStatus.effectiveType === '2g' ? 20000 :
                   networkStatus.effectiveType === '3g' ? 10000 : 5000;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok && retries > 0) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retries > 0 && networkStatus.isOnline) {
        console.warn(`Fetch failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry(url, options, retries - 1);
      }
      
      throw error;
    }
  }, [networkStatus]);

  return { fetchWithRetry, networkStatus };
}