import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCart } from "@/lib/api/api";
import { toast } from "@/components/ui/use-toast";

// Create context with default values to prevent undefined errors
const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  fetchCart: () => {},
  clearItem: () => {},
  cartTotal: 0,
  setCartTotal: () => {}
});

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const host = import.meta.env.VITE_BACKEND_HOST;

  // Check if we're in offline mode
  useEffect(() => {
    // Check initial state
    if (window._appConnectivity) {
      setIsOffline(window._appConnectivity.dynamicOffline);
    }
    
    // Listen for app offline events
    const handleAppOffline = () => {
      setIsOffline(true);
    };
    
    // Listen for online/offline events
    const handleOnline = () => {
      if (navigator.onLine && !window._appConnectivity?.dynamicOffline) {
        setIsOffline(false);
        fetchCart(); // Refresh cart when we come back online
      }
    };
    
    window.addEventListener('app:offline', handleAppOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('app:offline', handleAppOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const fetchCart = async () => {
    try {
      const cartIts = await getCart();
      
      // If we're offline or the request failed, use empty cart
      if (!cartIts || !cartIts.success) {
        if (isOffline) {
          // In offline mode, just use an empty cart or mock data
          setCartItems([]);
          setCartTotal(0);
        }
        return;
      }
      
      // If we have cart data, use it
      setCartItems(cartIts.cart.items || []);
      setCartTotal(cartIts.cart.totalPrice || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setCartTotal(0);
    }
  };

  const clearItem = async (productId) => {
    try {
      // Check for offline mode first
      if (isOffline || window._appConnectivity?.dynamicOffline) {
        toast({
          title: 'Offline Mode',
          description: 'Cart modifications are disabled in offline mode'
        });
        return false;
      }
      
      const token = localStorage.getItem("UserCookie");
      if (!token) {
        toast({title: 'Login to update cart'});
        return false;
      }

      try {
        const data = await fetch(`${host}/cart/clearitem/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Token: token,
          },
        });

        const response = await data.json();
        if (!response.success) {
          toast({title: 'Error'});
          return false;
        }

        toast({title: 'Item removed.'});

        setCartItems(response.cart.items || []);
        return true;
      } catch (error) {
        // Handle network errors
        console.error("Network error removing item:", error);
        toast({
          title: 'Network Error',
          description: 'Could not remove item due to connection issues'
        });
        return false;
      }
    } catch (error) {
      console.error("Error clearing item:", error);
      toast({title: 'Error removing item'});
      return false;
    }
  };

  useEffect(() => {
    // Initial cart fetch
    fetchCart();
    
    // Set up auto-refresh for cart when connectivity changes
    const refreshInterval = setInterval(() => {
      // Only refresh if we're online
      if (navigator.onLine && !window._appConnectivity?.dynamicOffline) {
        fetchCart();
      }
    }, 60000); // Every minute if online
    
    return () => clearInterval(refreshInterval);
  }, []);

  const value = {
    cartItems: cartItems || [], // Ensure we always return an array
    setCartItems,
    fetchCart,
    clearItem,
    cartTotal: cartTotal || 0, // Ensure we always return a number
    setCartTotal,
    isOffline
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
