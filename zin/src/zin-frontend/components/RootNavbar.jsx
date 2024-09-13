import { categories } from "@/lib/constants";
import GlobalSearch from "./GlobalSearch";
import { Link } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const RootNavbar = () => {
  return (
    <nav className="bg-dark-6 animate-in duration-1000 py-1 pt-3 w-full flex items-center justify-between max-sm:px-3 px-6">
      <div className="flex w-full items-center  gap-7">
        <Link to={`/`} className="flex  items-center gap-3">
          <img src="/icons/navbar.svg" className="w-11" />
          <h2 className="font-bold line-clamp-1">ZIN STORE</h2>
        </Link>
        <div className=" flex items-center gap-3">
          {categories.slice(0, 3).map((item) => (
            <Link
              key={item.value}
              className="text-zinc-300 max-sm:hidden hover:underline underline-offset-2 text-[15px]"
              to={
                item.value === ""
                  ? "/allproducts"
                  : `/allproducts/?filter=${item.value}`
              }
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex w-full gap-2 ">
        <GlobalSearch />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="border border-dark-4">
              <img src="/icons/cart.svg" alt="" className="w-4 invert " />
            </Button>
          </SheetTrigger>
          <SheetContent className="text-white">
            <h4 className="font-bold text-xl">My Cart</h4>
            
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default RootNavbar;
