import { Outlet } from "react-router-dom";
import RootNavbar from "../components/RootNavbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen w-full bg-dark-4">
      <RootNavbar />
      <div className="p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
