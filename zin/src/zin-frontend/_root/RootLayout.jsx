import { Outlet } from "react-router-dom";
import RootNavbar from "../components/RootNavbar";
import Footer from "../components/Footer";

const RootLayout = () => {

  return (
    <div className="min-h-screen w-full bg-dark-6">
      <RootNavbar />
      <div className="p-2 max-sm:mt-16  min-h-screen">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default RootLayout;
