import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCart } from "@/lib/api/api";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const cartItems = await getCart();
    if (cartItems.success) {
      setCartItems(cartItems.cart.items);
    }
  };

  useEffect(() => {
    fetchCart()
  }, [])

  const value = {
   cartItems,
   setCartItems,
   fetchCart,

  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
