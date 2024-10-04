import { useEffect } from "react";
import CartItemCard from "./CartItemCard";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cartItems, fetchCart, cartTotal } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="">
        <h4 className="font-bold text-xl">My Cart</h4>
        <div className="h-full mt-5 flex flex-col">
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <CartItemCard
                {...product.products}
                quantity={product.quantity}
                itemTotal={product.itemTotal}
                key={product.products._id}
              />
            ))
          ) : (
            <>No items</>
          )}
        </div>
      </div>
      {cartItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b border-zinc-700 py-1 font-mono items-end text-base text-zinc-400">
            <p>Taxes</p>
            <p className="text-base font-mono text-white">₹0.00</p>
          </div>
          <div className="flex justify-between border-b border-zinc-700 py-1 font-mono items-end text-base text-zinc-400">
            <p>Total</p>
            <p className="text-base font-mono text-white">₹{cartTotal}</p>
          </div>
          <Button className="py-2 rounded-full px-3 bg-blue-700">
            CheckOut
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
