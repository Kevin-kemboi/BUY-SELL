import { Outlet } from "react-router-dom";
import RootNavbar from "../components/RootNavbar";

const RootLayout = () => {
  
  return (
    <div className="min-h-screen w-full bg-dark-6">
      <RootNavbar />
      <div className="p-2 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
