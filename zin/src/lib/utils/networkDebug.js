// This module provides utility functions to help with debugging network connectivity
// It's only active in development mode or when VITE_DEBUG=1

const IS_DEV = import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1';

// Initialize the global connectivity state if it doesn't exist yet
if (typeof window !== 'undefined' && !window._appConnectivity) {
  window._appConnectivity = {
    dynamicOffline: false,
    lastNetworkFailure: 0,
    failureCount: 0,
    pendingRequests: 0
  };
}

// Helper to toggle mock offline mode for testing
export function toggleMockOfflineMode(forceState = null) {
  if (!IS_DEV) return false;
  
  if (window._appConnectivity) {
    // If forceState is provided, use that, otherwise toggle current state
    const newState = forceState !== null 
      ? !!forceState 
      : !window._appConnectivity.dynamicOffline;
      
    // Update the state
    window._appConnectivity.dynamicOffline = newState;
    
    if (newState) {
      window._appConnectivity.lastNetworkFailure = Date.now();
      window._appConnectivity.failureCount = window._appConnectivity.failureCount || 1;
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('app:offline', { 
        detail: { 
          reason: 'Manual toggle', 
          timestamp: Date.now(),
          count: window._appConnectivity.failureCount 
        } 
      }));
      
      console.log('%c[DEBUG] Offline mode enabled', 'background:#332200; color:#ffcc00; padding:2px 5px;');
    } else {
      window._appConnectivity.failureCount = 0;
      console.log('%c[DEBUG] Online mode enabled', 'background:#003322; color:#00cc66; padding:2px 5px;');
    }
    
    return newState;
  }
  
  return false;
}

// Helper to get the current connectivity state
export function getConnectivityState() {
  if (!IS_DEV) return { isOnline: true };
  
  if (window._appConnectivity) {
    return {
      isOnline: navigator.onLine,
      hasServerConnection: !window._appConnectivity.dynamicOffline,
      lastFailure: window._appConnectivity.lastNetworkFailure 
        ? new Date(window._appConnectivity.lastNetworkFailure).toLocaleTimeString() 
        : 'never',
      failureCount: window._appConnectivity.failureCount || 0,
      pendingRequests: window._appConnectivity.pendingRequests || 0
    };
  }
  
  return { isOnline: navigator.onLine };
}

// Add global debug command in development mode
if (IS_DEV && typeof window !== 'undefined') {
  window.toggleOffline = toggleMockOfflineMode;
  window.getConnectivityStatus = () => {
    const state = getConnectivityState();
    console.table(state);
    return state;
  };
  
  console.info(
    '%c[DEBUG] Network debugging utilities available:\n' +
    '- window.toggleOffline(): Toggle mock offline mode\n' +
    '- window.getConnectivityStatus(): Get current connectivity state',
    'background:#333; color:#bada55; padding:5px;'
  );
}

export default {
  toggleMockOfflineMode,
  getConnectivityState
};