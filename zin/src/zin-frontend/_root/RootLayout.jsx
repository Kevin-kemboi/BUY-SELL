import { Outlet } from "react-router-dom";
import RootNavbar from "../components/RootNavbar";
import GlobalSearch from "../components/GlobalSearch";

const RootLayout = () => {
  return (
    <div className="min-h-screen w-full bg-dark-6">
      <RootNavbar />
      <div className="p-2 max-sm:mt-16  min-h-screen">
        <div className=" max-sm:block hidden px-2 mb-5 w-full">
          <GlobalSearch />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
