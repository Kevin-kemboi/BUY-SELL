import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCart } from "@/lib/api/api";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const host = "http://localhost:5000";


  const fetchCart = async () => {
    const cartItems = await getCart();
    if (cartItems.success) {
      setCartItems(cartItems.cart.items);
    }
  };

  const clearItem = async (productId) => {
    try {
      const token = localStorage.getItem("UserCookie");
      if (!token) {
        console.log("Token not found");
        return false;
      }

      const data = await fetch(`${host}/cart/clearitem/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Token: token,
        },
      });

      const response = await data.json();
      if (!response.success) {
        return false;
      }

      setCartItems(response.cart.items)
      return true
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cartItems,
    setCartItems,
    fetchCart,
    clearItem
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
