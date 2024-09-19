import { useEffect } from "react";
import CartItemCard from "./CartItemCard";
import { useCart } from "../context/CartContext";

const Cart = () => {

  const { cartItems, fetchCart } = useCart()

  useEffect(() => {
    fetchCart()
  }, [])
  

  return (
    <>
      <h4 className="font-bold text-xl">My Cart</h4>
      <div className="h-full mt-5 flex flex-col">
        {cartItems.length > 0
        ? cartItems.map((product)=>(

          <CartItemCard {...product.products} quantity={product.quantity} itemTotal={product.itemTotal}  key={product.products._id} />
        )) 
        : (
          <>No items</>
        )
      }
      </div>
    </>
  );
};

export default Cart;
