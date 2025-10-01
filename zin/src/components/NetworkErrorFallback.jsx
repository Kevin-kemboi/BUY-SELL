import React, { useState, useEffect } from 'react';
import { CloudOff, RefreshCw, Check, WifiOff, ServerCrash, Wifi } from 'lucide-react';
import { Button } from './ui/button';

// Maximum cooldown in seconds between retries (increases with attempt count)
const MAX_COOLDOWN = 15;

// Show debug info in development mode
const IS_DEV = import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1';

const NetworkErrorFallback = ({ message, onRetry, attemptCount = 0 }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastRetryTime, setLastRetryTime] = useState(0);
  const [canRetry, setCanRetry] = useState(true);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  
  // Calculate cooldown time based on attempts (progressive backoff)
  const calculateCooldown = () => {
    // Base cooldown of 5 seconds
    let cooldown = 5;
    
    // Add 2 seconds per attempt up to MAX_COOLDOWN
    if (attemptCount > 3) {
      cooldown = Math.min(cooldown + (attemptCount - 3) * 2, MAX_COOLDOWN);
    }
    
    return cooldown * 1000; // Convert to milliseconds
  };
  
  // Prevent retry spam by enforcing a cooldown with progressive backoff
  useEffect(() => {
    if (lastRetryTime > 0) {
      const cooldownTime = calculateCooldown();
      setCanRetry(false);
      
      // Update the countdown timer
      const interval = setInterval(() => {
        const elapsed = Date.now() - lastRetryTime;
        const remaining = Math.max(0, Math.ceil((cooldownTime - elapsed) / 1000));
        setCooldownRemaining(remaining);
        
        if (elapsed >= cooldownTime) {
          setCanRetry(true);
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [lastRetryTime, attemptCount]);
  
  const handleRetry = async () => {
    if (!canRetry || !onRetry) return;
    
    setIsRetrying(true);
    setLastRetryTime(Date.now());
    
    try {
      const result = await onRetry();
      // Keep showing spinner for 1s after success for visual feedback
      setTimeout(() => {
        setIsRetrying(false);
      }, 1000);
    } catch (error) {
      setIsRetrying(false);
    }
  };
  
  // Choose the appropriate icon based on the message or attempt count
  const getStatusIcon = () => {
    if (message.includes("offline")) return <WifiOff className="w-4 h-4 text-amber-500/80" />;
    if (message.includes("unavailable") || message.includes("server")) return <ServerCrash className="w-4 h-4 text-amber-500/80" />;
    if (message.includes("Connecting")) return <Wifi className="w-4 h-4 text-amber-500/80 animate-pulse" />;
    return <CloudOff className="w-4 h-4 text-amber-500/80" />;
  };
  
  return (
    <div className="w-full flex flex-col items-center justify-center p-3 my-2 rounded-lg border border-amber-700/20 bg-amber-900/5">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div className="flex flex-col">
          <p className="text-zinc-300 text-sm max-w-md">
            {message || "Running in offline mode with mock data. Some features may be limited."}
          </p>
          
          {/* Show attempt info in development mode */}
          {IS_DEV && attemptCount > 0 && (
            <span className="text-xs text-zinc-500">
              Connection attempts: {attemptCount}
            </span>
          )}
        </div>
        
        {onRetry && (
          <Button 
            onClick={handleRetry} 
            variant="ghost" 
            size="sm"
            disabled={isRetrying || !canRetry}
            className="h-7 px-2 text-xs flex items-center gap-1 ml-auto opacity-80 hover:opacity-100"
          >
            {isRetrying ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {!canRetry && cooldownRemaining > 0 ? `Retry (${cooldownRemaining}s)` : "Retry"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NetworkErrorFallback;