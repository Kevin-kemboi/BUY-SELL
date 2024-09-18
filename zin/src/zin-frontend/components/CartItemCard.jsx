import Quantity from "@/components/ui/quantity-adder";
import { X } from "lucide-react";

const CartItemCard = ({name, price, quantity, imageUrl}) => {
  return (
    <div className="border-b min-h-[80px] h-[83px] overflow-hidden mt-1 border-dark-5/30 flex items-start justify-between  w-full p-2 ">
      <div className="relative max-w-[4rem]  w-[6rem]  h-full flex items-center justify-center ">
        <img
          src={imageUrl}
          alt=""
          className="object-contain"
        />
        <X className="absolute top-0 -left-1 text-dark-5/70 bg-zinc-500/20 cursor-pointer hover:text-white/90 rounded-full p-1 backdrop-blur-md backdrop-saturate-200 size-5" />
      </div>
      <div className="h-full flex pb-1 items-start py-2  text-wrap line-clamp-2  px-2 capitalize text-xs font-bold ">
        {name}
      </div>
      <div className=" gap-1  h-[100%] flex flex-col items-center justify-center">
        <div className=" w-full flex items-center justify-center text-xs font-medium">
        ₹{price}
        </div>
        <Quantity itemQuantity={quantity}  />
      </div>
    </div>
  );
};

export default CartItemCard;
