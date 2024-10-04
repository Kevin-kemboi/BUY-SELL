import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { getProductsFrontend } from "@/lib/api/api";
import LeftSidebar from "@/zinfrontend/components/LeftSidebar";
import RightSidebar from "@/zinfrontend/components/RightSidebar";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Loader, Settings2 } from "lucide-react";
import Filters from "@/zinfrontend/components/FIlters";
import { categories, sortOptions } from "@/lib/constants";
import SortOptions from "@/zinfrontend/components/SortOptions";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter") || "";
  const sortBy = searchParams.get("sortby") || "";

  const fetchProducts = async () => {
    const response = await getProductsFrontend({ filter, sortBy });
    if (response.success) {
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter, sortBy]);

  return (
    <div className=" max-w-6xl flex mx-auto max-sm:flex-col ">
      <LeftSidebar />
      <div className="mb-4 mx-2 sm:hidden">
        <Drawer>
          <DrawerTrigger className="flex gap-2 items-center justify-center font-mono p-1  rounded-md">
            Filters <Settings2 className="w-4" />
          </DrawerTrigger>
          <DrawerContent className="border-none px-7 py-8 bg-dark-6 text-white">
            <div className="flex justify-between py-5">
              <div className="">
                <p className="text-xs my-2 text-zinc-400">CATEGORIES</p>
                <Filters filters={categories} />
              </div>
              <div className="">
                <p className="text-xs my-2 text-zinc-400 text-end">SORT BY</p>
                <SortOptions sortBy={sortOptions} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <BlurFade className="size-full relative max-sm:px-1 mx-auto px-6 grid md:grid-cols-3 grid-cols-2 gap-2 duration-200">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="relative p-7 h-[250px] xl:h-[300px] cursor-pointer overflow-hidden rounded-md border  border-dark-4 group bg-dark-1/40 flex justify-center items-center hover:border-blue-500 "
            >
              <img
                src={product.imageUrl}
                className=" size-[85%] absolute m-auto inset-0 left-0 right-0 bottom-0 top-0 object-contain group-hover:scale-110  transition-all duration-300"
              />
              <div className="z-5 absolute bottom-2 left-0 mx-2 flex items-center gap-1 border border-light-2/20 pl-3 pr-1 py-1 rounded-full bg-zinc-600/10 backdrop-blur-lg backdrop-saturate-100">
                <p className="pr-1 text-xs line-clamp-1 capitalize">
                  {product.name}
                </p>
                <p className="bg-blue-700 rounded-full text-xs px-2 py-1">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className=" w-full h-screen absolute flex items-center justify-center">
            <Loader className="animate-spin w-6" />
          </div>
        )}
      </BlurFade>
      <RightSidebar />
    </div>
  );
};

export default AllProducts;
