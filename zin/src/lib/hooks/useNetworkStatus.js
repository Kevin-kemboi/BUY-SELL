import { useState, useEffect, useCallback, useRef } from 'react';

// Debug flag to control logging
const DEBUG = import.meta.env.VITE_DEBUG === '1';
// Development mode flag
const IS_DEV = import.meta.env.DEV || DEBUG;

// Network check settings
const CHECK_INTERVAL = IS_DEV ? 30000 : 60000; // Check every 30s in dev, 60s in production
const MIN_CHECK_INTERVAL = IS_DEV ? 5000 : 10000; // Minimum time between checks
const RETRY_TIMEOUT = 2000; // 2 seconds timeout for health checks
const OFFLINE_MEMORY = 30000; // How long to remember network failures (30s)

// Use shared app connectivity state if available
const getAppOfflineState = () => {
  if (window._appConnectivity) {
    return {
      isDynamicOffline: window._appConnectivity.dynamicOffline,
      lastFailureTime: window._appConnectivity.lastNetworkFailure,
      failureCount: window._appConnectivity.failureCount || 0
    };
  }
  return { isDynamicOffline: false, lastFailureTime: 0, failureCount: 0 };
};

// Update the global app connectivity state
const updateAppOfflineState = (isOffline, failureCount = null) => {
  if (window._appConnectivity) {
    window._appConnectivity.dynamicOffline = isOffline;
    
    if (isOffline) {
      window._appConnectivity.lastNetworkFailure = Date.now();
      // Update failure count if provided, otherwise increment
      if (failureCount !== null) {
        window._appConnectivity.failureCount = failureCount;
      } else if (window._appConnectivity.failureCount !== undefined) {
        window._appConnectivity.failureCount++;
      } else {
        window._appConnectivity.failureCount = 1;
      }
    } else {
      // Reset failure count on successful connection
      window._appConnectivity.failureCount = 0;
    }
    
    if (DEBUG) {
      console.log(`[Network] App offline state: ${isOffline ? 'OFFLINE' : 'ONLINE'}, failures: ${window._appConnectivity.failureCount || 0}`);
    }
  }
};

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasServerConnection, setHasServerConnection] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const lastCheckTime = useRef(0);
  const checkTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  
  // Calculate exponential backoff time for retries
  const getBackoffTime = useCallback(() => {
    // Start with base interval
    const baseInterval = MIN_CHECK_INTERVAL;
    const attempts = reconnectAttempts.current;
    
    if (attempts <= 1) return baseInterval;
    
    // Exponential backoff with max of 5 minutes
    const backoff = Math.min(
      baseInterval * Math.pow(1.5, Math.min(attempts - 1, 10)), 
      300000 // 5 minutes max
    );
    
    // Add some jitter (±15%) to prevent all clients from retrying simultaneously
    const jitter = (Math.random() * 0.3) - 0.15;
    return Math.floor(backoff * (1 + jitter));
  }, []);
  
  // Update online status when browser connectivity changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Check server connection when we come back online
      checkServerConnection(true);
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check server connectivity by pinging the health endpoint
  const checkServerConnection = useCallback(async (force = false) => {
    // Clear any pending check timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
      checkTimeoutRef.current = null;
    }
    
    // Avoid checking too frequently unless forced
    const now = Date.now();
    if (!force && now - lastCheckTime.current < MIN_CHECK_INTERVAL) {
      return hasServerConnection;
    }
    
    if (!isOnline) {
      setHasServerConnection(false);
      return false;
    }
    
    // Check if the app is already in dynamic offline mode via the api.js module
    const { isDynamicOffline, lastFailureTime } = getAppOfflineState();
    if (!force && isDynamicOffline && now - lastFailureTime < OFFLINE_MEMORY) {
      // API layer already detected network failure recently
      setHasServerConnection(false);
      return false;
    }
    
    setIsChecking(true);
    lastCheckTime.current = now;
    
    try {
      const host = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:5000';

      // Create a simple image ping request first to check basic connectivity
      // This avoids the ERR_CONNECTION_REFUSED errors entirely
      let hasInternetConnectivity = true;
      try {
        // First check if we have basic internet connectivity with a tiny image request
        const checkConnectivity = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
          setTimeout(() => resolve(false), 1000); // Timeout after 1s
        });
        
        hasInternetConnectivity = checkConnectivity;
        
        // If we don't have basic connectivity, don't even try the server
        if (!hasInternetConnectivity) {
          setHasServerConnection(false);
          reconnectAttempts.current++;
          updateAppOfflineState(true);
          return false;
        }
      } catch (e) {
        // If even this fails, we're definitely offline
        hasInternetConnectivity = false;
        setHasServerConnection(false);
        reconnectAttempts.current++;
        updateAppOfflineState(true);
        return false;
      }
      
      // If we have internet, try the server health check with our silent fetch
      try {
        // Create a specially crafted request that the fetch interceptor will handle silently
        const resp = await new Promise((resolve) => {
          const timeoutId = setTimeout(() => resolve({ ok: false }), RETRY_TIMEOUT);
          
          // Use fetch with special health check header
          fetch(`${host}/health`, { 
            method: 'GET',
            headers: { 
              'Cache-Control': 'no-cache',
              'X-Health-Check': 'true' // Special header for health checks
            },
            // Signal that this is a health check to the fetch interceptor
            silence: true,
            timeout: RETRY_TIMEOUT
          })
          .then(response => {
            clearTimeout(timeoutId);
            resolve(response);
          })
          .catch(() => {
            clearTimeout(timeoutId);
            resolve({ ok: false });
          });
        });
        
        const isConnected = resp.ok;
        
        if (isConnected) {
          // Connection successful
          setHasServerConnection(true);
          reconnectAttempts.current = 0;
          updateAppOfflineState(false, 0);
          
          // Schedule next check at regular interval
          checkTimeoutRef.current = setTimeout(() => {
            checkServerConnection();
          }, CHECK_INTERVAL);
        } else {
          // Connection failed
          setHasServerConnection(false);
          reconnectAttempts.current++;
          updateAppOfflineState(true);
          
          // Schedule next check with exponential backoff
          const backoffTime = getBackoffTime();
          if (DEBUG) {
            console.log(`[Network] Reconnect failed. Attempt: ${reconnectAttempts.current}. Next retry in ${Math.round(backoffTime/1000)}s`);
          }
          
          checkTimeoutRef.current = setTimeout(() => {
            checkServerConnection();
          }, backoffTime);
        }
        
        return isConnected;
      } catch (e) {
        // This catch should never be needed since we catch errors above,
        // but it ensures absolutely no errors escape
        setHasServerConnection(false);
        updateAppOfflineState(true);
        return false;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      // This outer catch is now mostly redundant
      setHasServerConnection(false);
      updateAppOfflineState(true);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isOnline, hasServerConnection, getBackoffTime]);
  
  // Check server connection on mount and set up retries
  useEffect(() => {
    // Initialize reconnect attempts from shared state
    const { failureCount } = getAppOfflineState();
    reconnectAttempts.current = failureCount || 0;
    
    // Initial check only if not known to be offline
    const { isDynamicOffline, lastFailureTime } = getAppOfflineState();
    if (!isDynamicOffline || Date.now() - lastFailureTime > OFFLINE_MEMORY) {
      // Small delay for initial check to allow app to finish loading
      setTimeout(() => {
        checkServerConnection(true);
      }, 500);
    } else {
      // If api.js already knows we're offline, respect that state
      setHasServerConnection(false);
      
      // Schedule next check with backoff
      checkTimeoutRef.current = setTimeout(() => {
        checkServerConnection();
      }, getBackoffTime());
    }
    
    // Clean up any pending timers
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [isOnline, checkServerConnection, getBackoffTime]);
  
  return { 
    isOnline, 
    hasServerConnection, 
    isChecking,
    checkServerConnection: () => checkServerConnection(true), // Force check when manually called
    reconnectAttempts: reconnectAttempts.current
  };
}