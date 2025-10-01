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
import { LogIn, LogOut, ShoppingCart } from "lucide-react";
import Cart from "./Cart";
import MobileNav from "./MobileNav";
import { useDeviceWidth } from "../hooks/useDeviceWidth";
import { useCart } from "../context/CartContext";

const RootNavbar = () => {
  const authCtx = useUserAuth();
  const isUserAuthenticated = authCtx?.isUserAuthenticated || false;
  const userLogout = authCtx?.userLogout || (() => {});
  const isMobile = useDeviceWidth();
  const { cartItems } = useCart();

  return (
    <nav className="bg-dark-6 max-sm:absolute z-20 top-0 max-sm:gap-1 py-1 pt-3 w-full flex items-center justify-between max-sm:px-3 px-6">
      <div className=" h-7 ">
        <MobileNav />
      </div>
      <div className="flex w-full max-sm:w-max  items-center  gap-7">
        <Link to={`/`} className="flex  items-center gap-3 max-sm:gap-1">
          <img src="/icons/navbar.svg" className="w-11" />
          <h2 className="font-bold line-clamp-1 max-md:hidden max-sm:block">
            BUY
          </h2>
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
      <div className="flex  sm:w-full h-7 gap-2 max-sm:gap-1  px-1 justify-end ">
        {!isMobile && (
          <div className="w-full max-sm:hidden  flex justify-end">
            <GlobalSearch />
          </div>
        )}
        <Menubar>
          <MenubarMenu className="bg-dark-6">
            <MenubarTrigger className="bg-dark-6 px-2 py-1 h-full sm:border border-dark-4">
              {!isUserAuthenticated ? (
                <LogIn className="sm:max-w-4" />
              ) : (
                <LogOut className="sm:max-w-4" />
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
            <Button className="sm:border hover:bg-transparent group h-full border-dark-4 bg-dark-6 px-2 relative">
              {cartItems.length <= 0 ? (
                <ShoppingCart className="sm:max-w-4" />
              ) : (
                <div className="">
                  <ShoppingCart className="sm:max-w-4" />
                  <div className="absolute -top-1.5 -right-0 text-xs font-mono">{cartItems.length}</div>
                </div>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="text-white">
            <Cart />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default RootNavbar;
