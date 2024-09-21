import { categories } from "@/lib/constants";
import { Link } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
    
  return (
    <>
      <Sheet>
        <SheetTrigger className="h-full sm:hidden" asChild>
          <Button className="sm:border hover:bg-transparent group h-full border-dark-4 bg-dark-6 px-2 ">
            <Menu className="sm:max-w-4 " />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="text-white flex flex-col">
          <div className="">
            <Link to={`/`} className="flex  items-center gap-3 max-sm:gap-1">
              <img src="/icons/navbar.svg" className="w-11" />
              <h2 className="font-bold line-clamp-1">ZIN STORE</h2>
            </Link>
          </div>
          <div className=" flex flex-col px-1  gap-3">
            {categories.map((item) => (
              <SheetClose key={item.value} asChild>
                <Link
                  className="text-zinc-300 hover:underline underline-offset-2 text-[17px]"
                  to={
                    item.value === ""
                      ? "/allproducts"
                      : `/allproducts/?filter=${item.value}`
                  }
                >
                  {item.name}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNav;
