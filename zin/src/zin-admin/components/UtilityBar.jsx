import { Link, useLocation } from "react-router-dom";

const UtilityBar = () => {
  const { pathname } = useLocation();
  const isManageProductsPage = [
    "/admin/products",
    "/admin/addproducts",
    "/admin/productslist",
  ].includes(pathname);

  return (
    <div className="w-max mx-auto px-10 rounded-3xl flex gap-5 items-center justify-center h-16 m-4 max-sm:max-w-[300px] max-sm:text-xs max-sm:gap-1">
      <Link to="/admin">
        <div
          className={`flex gap-2 bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ${
            pathname === "/admin" ? "text-pink-300 bg-zinc-800" : ""
          }`}
        > 
          <img src="/icons/home.svg" className="w-5" />
          Home
        </div>
      </Link>
      <Link to="/admin/users">
        <div
          className={`flex gap-2 bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ${
            pathname === "/admin/users" ? "text-pink-300 bg-zinc-800" : ""
          }`}
        >
          <img src="/icons/people.svg" className="w-5" />
          Users
        </div>
      </Link>
      <Link to="/admin/products">
        <div
          className={`flex gap-2 bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ${
            isManageProductsPage ? "text-pink-300 bg-zinc-800" : ""
          }`}
        >
          <img src="/icons/manage.svg" className="w-5" />
          Manage Products
        </div>
      </Link>
      <Link to="">
        <div
          className={`flex gap-2 bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ${
            pathname === "/" ? "text-pink-300 bg-zinc-800" : ""
          }`}
        >
          <img src="/icons/webConfig.svg" className="w-5" />
          Website Config
        </div>
      </Link>
    </div>
  );
};

export default UtilityBar;
