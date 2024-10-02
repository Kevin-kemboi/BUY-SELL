import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { addItemToCart, removeItemFromCart } from "@/lib/api/api";
import { useCart } from "@/zin-frontend/context/CartContext";

export default function Quantity({ itemQuantity, productId, itemTotal }) {
  const [quantity, setQuantity] = useState(itemQuantity);
  const [total, setTotal] = useState(itemTotal);
  const { clearItem } = useCart();

  const decrease = async () => {
    const item = await removeItemFromCart(productId);
    console.log(item);
    setTotal(item.totalPrice);
    setQuantity(item.quantity);
  };

  const increase = async () => {
    const item = await addItemToCart(productId);
    console.log(item);
    setTotal(item.totalPrice);
    setQuantity(item.quantity);
  };

  useEffect(() => {
    if (quantity <= 0) {
      clearItem(productId);
    }
  }, [quantity]);

  return (
    <div className=" gap-1  h-[100%] flex flex-col items-center justify-center">
      <div className=" w-full flex items-center justify-center text-xs font-extralight font-mono">
        ₹{total}
      </div>
      <div className="flex items-center justify-center h-7 w-max  rounded-md border border-dark-4 overflow-hidden">
        <Button
          className="h-full p-2 bg-transparent text-dark-5/70 hover:text-white  rounded-full "
          onClick={decrease}
          aria-label="Decrease quantity"
        >
          <Minus className="w-3" />
        </Button>
        <div className="text-center text-xs  min-w-[14px]" aria-live="polite">
          {quantity}
        </div>
        <Button
          className="h-full p-2 bg-transparent text-dark-5/70 hover:text-white rounded-full "
          onClick={increase}
          aria-label="Increase quantity"
        >
          <Plus className="w-3" />
        </Button>
      </div>
    </div>
  );
}
