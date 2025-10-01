import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ServerCrash } from 'lucide-react';

// A minimal network status indicator that can be placed in the footer or corner of the app
const NetworkStatusIndicator = () => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: navigator.onLine,
    hasServerConnection: true
  });
  
  // Only show in development mode
  const IS_DEV = import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1';
  
  useEffect(() => {
    // Update browser online/offline status
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true }));
    };
    
    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
    };
    
    // Handle server connection status changes from the API layer
    const handleServerStatusChange = () => {
      if (window._appConnectivity) {
        setNetworkStatus(prev => ({
          ...prev,
          hasServerConnection: !window._appConnectivity.dynamicOffline
        }));
      }
    };
    
    // Listen for app offline events from api.js
    const handleAppOffline = (event) => {
      setNetworkStatus(prev => ({ ...prev, hasServerConnection: false }));
    };
    
    // Check initial state
    if (window._appConnectivity) {
      setNetworkStatus({
        isOnline: navigator.onLine,
        hasServerConnection: !window._appConnectivity.dynamicOffline
      });
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('app:offline', handleAppOffline);
    
    // Check status periodically
    const interval = setInterval(handleServerStatusChange, 5000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('app:offline', handleAppOffline);
      clearInterval(interval);
    };
  }, []);
  
  // Only show in development mode
  if (!IS_DEV) return null;
  
  // If everything is fine, don't show anything
  if (networkStatus.isOnline && networkStatus.hasServerConnection) {
    return null;
  }
  
  return (
    <div className="fixed bottom-2 right-2 bg-zinc-800/80 rounded-full p-1 shadow-md flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
      {!networkStatus.isOnline ? (
        <>
          <WifiOff size={12} className="text-red-400" />
          <span className="text-xs text-zinc-300 pr-1">Offline</span>
        </>
      ) : !networkStatus.hasServerConnection ? (
        <>
          <ServerCrash size={12} className="text-amber-400" />
          <span className="text-xs text-zinc-300 pr-1">Server offline</span>
        </>
      ) : (
        <>
          <Wifi size={12} className="text-green-400" />
          <span className="text-xs text-zinc-300 pr-1">Online</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;