import Quantity from "@/components/ui/quantity-adder";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItemCard = ({ name, itemTotal, quantity, imageUrl, _id }) => {
  const {clearItem} = useCart()
  
  return (
    <div className="border-b  min-h-[80px] h-[83px] overflow-hidden mt-1 border-dark-4 flex items-start justify-between  w-full p-2 px-1 ">
      <div className="overflow-hidden relative max-w-[4.5rem]  w-[4.5rem]  h-full flex items-center justify-center ">
        <img src={imageUrl} alt="" className=" object-cover size-[85%]" />
        <X onClick={()=> clearItem(_id)} className="absolute top-0.5 left-0 text-dark-5/70 bg-zinc-500/20 cursor-pointer hover:text-white/90 rounded-full p-1 backdrop-blur-md backdrop-saturate-200 size-5" />
      </div>
      <div className="h-full flex pb-1 items-start py-2 w-1/2 text-wrap line-clamp-2  px-2 capitalize text-xs font-bold ">
        {name}
      </div>

      <Quantity itemQuantity={quantity} itemTotal={itemTotal} productId={_id} />
    </div>
  );
};

export default CartItemCard;
