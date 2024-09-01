import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import UtilityBar from "../components/UtilityBar";
import Footer from "../components/Footer";

const AdminRootLayout = () => {


  return (
    <div>
      <Navbar />
      <UtilityBar/>
      <div className="bg-dark-2 rounded-xl p-5 lg:w-[50%] max-lg:w-[70%] mx-auto min-h-[75vh] relative max-sm:w-[95%]">
        <Outlet /> 
      </div>
      <Footer/>
    </div>
  );
};

export default AdminRootLayout;
