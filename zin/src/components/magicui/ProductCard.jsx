import { cn } from "@/lib/utils";

export const ProductCard = ({ _id, name, price, imageUrl }) => {
  return (
    <figure
      className={cn(
        "relative w-[400px]  mx-1 h-[250px] cursor-pointer overflow-hidden rounded-md border p-10 border-dark-4  bg-dark-1/40 flex justify-center items-center hover:border-blue-500"
      )}
    >
      <img
        src={imageUrl}
        className=" h-[85%] w-full absolute m-auto inset-0 left-0 right-0 bottom-0 top-0 object-contain hover:scale-110 transition-all duration-300"
      />
      <div className="z-10 absolute bottom-5 left-3 mx-2 flex items-center gap-2 border border-light-2/30 pl-3 pr-1 py-1 rounded-full bg-zinc-600/10 backdrop-blur-xl backdrop-saturate-200">
        <p className="px-2 line-clamp-1 capitalize">{name}</p>
        <p className="bg-blue-500 rounded-full py-1 px-2">₹{price}</p>
      </div>
    </figure>
  );
};
