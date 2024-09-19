import { categories } from "@/lib/constants";
import GlobalSearch from "./GlobalSearch";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useUserAuth } from "../context/UserAuthProvider";
import { LogIn, LogOut, Menu, ShoppingCart } from "lucide-react";
import Cart from "./Cart";

const RootNavbar = () => {
  const { isUserAuthenticated, userLogout } = useUserAuth();

  return (
    <nav className="bg-dark-6 max-sm:gap-1 animate-in duration-1000 py-1 pt-3 w-full flex items-center justify-between max-sm:px-3 px-6">
      <div className="flex w-full max-sm:w-max items-center  gap-7">
        <Link to={`/`} className="flex  items-center gap-3">
          <img src="/icons/navbar.svg" className="w-11" />
          <h2 className="font-bold line-clamp-1 max-sm:hidden">ZIN STORE</h2>
        </Link>
        <div className=" flex max-sm:hidden items-center gap-3">
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
      <div className="flex  w-full h-7 gap-2 max-sm:gap-1  px-1 justify-end ">
        <GlobalSearch />
        <Menubar>
          <MenubarMenu className="bg-dark-6">
            <MenubarTrigger className="bg-dark-6 px-2 py-1 h-full border border-dark-4">
              {!isUserAuthenticated ? (
                <LogIn className="max-w-4" />
              ) : (
                <LogOut className="max-w-4" />
              )}
            </MenubarTrigger>
            <MenubarContent>
              {!isUserAuthenticated ? (
                <>
                  <MenubarItem>
                    <Link to="/signup" className="w-full px-2 py-1">
                      Sign-up
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link to="/login" className="w-full px-2 py-1">
                      Log-in
                    </Link>
                  </MenubarItem>
                </>
              ) : (
                <MenubarItem>
                  <Button
                    onClick={userLogout}
                    className="w-full px-2 py-1 bg-dark-6"
                  >
                    Log-out
                  </Button>
                </MenubarItem>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <Sheet>
          <SheetTrigger className="h-full" asChild>
            <Button className="border hover:bg-transparent group h-full border-dark-4 bg-dark-6 px-2 ">
              <ShoppingCart className="max-w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="text-white">
            <Cart />
          </SheetContent>
        </Sheet>


        <Sheet  >
          <SheetTrigger className="h-full sm:hidden" asChild>
            <Button className="border hover:bg-transparent group h-full border-dark-4 bg-dark-6 px-2 ">
              <Menu className="max-w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="text-white">
            
          </SheetContent>
        </Sheet>


      </div>
    </nav>
  );
};

export default RootNavbar;
