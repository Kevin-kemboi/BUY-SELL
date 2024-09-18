import Quantity from "@/components/ui/quantity-adder";
import { X } from "lucide-react";

const CartItemCard = () => {
  return (
    <div className="border-b min-h-[80px] h-[83px] border-dark-5/30 flex items-start justify-between  w-full p-2 ">
      <div className="relative   h-full">
        <img
          src="/uploads/file-1725988908216.png"
          alt=""
          className="w-[14rem]"
        />
        <X className="absolute top-0 -left-1 text-dark-5/70 bg-zinc-500/20 cursor-pointer hover:text-white/90 rounded-full p-1 backdrop-blur-md backdrop-saturate-200" />
      </div>
      <div className="h-full px-2 line-clamp-1 w-full capitalize text-sm font-bold ">
        cap
      </div>
      <div className="w-full gap-1  h-[100%] flex flex-col items-center justify-start">
        <div className=" w-full flex items-center justify-center text-md font-medium">
          $100
        </div>
        <Quantity />
      </div>
    </div>
  );
};

export default CartItemCard;
