import { Outlet } from "react-router-dom";
import RootNavbar from "../components/RootNavbar";
import Footer from "../components/Footer";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import NetworkErrorFallback from "@/components/NetworkErrorFallback";
import { useEffect, useState, useCallback } from "react";

// Check if in development mode - we can hide the banner in production if needed
const IS_DEV = import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1';
// Only show the banner in production after multiple connection attempts
const CONNECTION_ATTEMPTS_THRESHOLD = IS_DEV ? 1 : 3;

const RootLayout = () => {
  const { isOnline, hasServerConnection, checkServerConnection, isChecking } = useNetworkStatus();
  const [showNetworkBanner, setShowNetworkBanner] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Custom retry handler that tracks attempts
  const handleRetry = useCallback(async () => {
    if (await checkServerConnection()) {
      // Connection restored
      setConnectionAttempts(0);
    } else {
      // Failed attempt
      setConnectionAttempts(prev => prev + 1);
    }
  }, [checkServerConnection]);
  
  // Check for global app connectivity state
  useEffect(() => {
    // Get failure count from global state if available
    if (window._appConnectivity && window._appConnectivity.failureCount !== undefined) {
      setConnectionAttempts(window._appConnectivity.failureCount);
    }
    
    // Listen for offline events from the API layer
    const handleOfflineEvent = (event) => {
      if (event.detail && event.detail.count) {
        setConnectionAttempts(event.detail.count);
      }
    };
    
    window.addEventListener('app:offline', handleOfflineEvent);
    
    return () => {
      window.removeEventListener('app:offline', handleOfflineEvent);
    };
  }, []);
  
  // Add a delay before showing the banner to prevent flickering on initial load
  // Only show after multiple failed attempts in production
  useEffect(() => {
    let timer;
    
    if (!isOnline || !hasServerConnection) {
      // Only increment if we don't already have a value from the global state
      if (window._appConnectivity?.failureCount === undefined) {
        setConnectionAttempts(prev => prev + 1);
      }
      
      // Only show banner after threshold attempts or immediately in dev
      if (connectionAttempts >= CONNECTION_ATTEMPTS_THRESHOLD) {
        // Delay showing the banner by 1 second to avoid flash on initial load
        timer = setTimeout(() => {
          setShowNetworkBanner(true);
        }, 1000);
      }
    } else {
      // Reset counts when back online
      setConnectionAttempts(0);
      if (window._appConnectivity) {
        window._appConnectivity.failureCount = 0;
      }
      setShowNetworkBanner(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOnline, hasServerConnection, connectionAttempts]);

  // Function to determine message based on connection state and attempts
  const getNetworkMessage = useCallback(() => {
    if (!isOnline) return "Your device is offline. Using cached data.";
    
    if (!hasServerConnection) {
      // Custom messages based on attempts
      if (connectionAttempts <= 2) return "Connecting to server...";
      if (connectionAttempts <= 5) return "Still trying to connect to server...";
      return "Backend server unavailable. Running in offline mode with mock data.";
    }
    
    return "Connection issue detected.";
  }, [isOnline, hasServerConnection, connectionAttempts]);
  
  return (
    <div className="min-h-screen w-full bg-dark-6">
      <RootNavbar />
      
      {showNetworkBanner && (
        <div className="px-4 md:px-8 lg:px-16 pt-0.5">
          <NetworkErrorFallback 
            message={getNetworkMessage()}
            onRetry={!isChecking ? handleRetry : undefined}
            attemptCount={connectionAttempts}
          />
        </div>
      )}
      
      <div className="p-2 max-sm:mt-16 min-h-screen">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default RootLayout;
