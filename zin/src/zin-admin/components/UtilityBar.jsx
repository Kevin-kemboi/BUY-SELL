import { Link, useLocation } from "react-router-dom";

const UtilityBar = () => {
  const { pathname } = useLocation();
  const isManageProductsPage = [
    "/admin/products",
    "/admin/addproducts", 
    "/admin/productslist",
    "/admin/deleteproducts",
    "/admin/updateproducts"
  ].includes(pathname);
  const isManageUsersPage = [
    "/admin/users",
    "/admin/admin-users", 
  ].includes(pathname);

  return (
    <div className="w-max mx-auto px-10 rounded-3xl flex gap-5 items-center justify-center h-16 max-sm:h-12 m-4 max-sm:max-w-[80%] max-sm:text-xs max-sm:p-0 max-sm:gap-7">
      <Link to="/admin">
        <div
          className={`group flex gap-2 bg-dark-3 py-2 rounded-md px-4 font-semibold cursor-pointer  hover:bg-zinc-800 ${
            pathname === "/admin" ? " bg-zinc-800" : ""
          }`}
        >
          <img src="/icons/home.svg" className="w-5 group-hover:fill-current " />
          <span className="max-sm:hidden ">Home</span>
        </div>
      </Link>
      <Link to="/admin/users">
        <div
          className={`group flex gap-2 bg-dark-3 py-2 rounded-md px-4 font-semibold cursor-pointer  hover:bg-zinc-800 ${
            isManageUsersPage ? " bg-zinc-800" : ""
          }`}
        >
          <img src="/icons/people.svg" className="w-5 group-hover:fill-black " />
          <span className="max-sm:hidden ">Users</span>
        </div>
      </Link>
      <Link to="/admin/products">
        <div
          className={`group flex gap-2 bg-dark-3 py-2 rounded-md px-4 font-semibold cursor-pointer  hover:bg-zinc-800 ${
            isManageProductsPage ? " bg-zinc-800" : ""
          }`}
        >
          <img src="/icons/manage.svg" className="w-5 group-hover:fill-current " />
          <span className="max-sm:hidden ">Products</span>
        </div>
      </Link>
      <Link to="">
        <div
          className={`group flex gap-2 bg-dark-3 py-2 rounded-md px-4 font-semibold cursor-pointer  hover:bg-zinc-800 ${
            pathname === "/" ? " bg-zinc-800" : ""
          }`}
        >
          <img src="/icons/webConfig.svg" className="w-5 group-hover:fill-current " />
          <span className="max-sm:hidden ">Website config</span>
        </div>
      </Link>
    </div>
  );
};

export default UtilityBar;
