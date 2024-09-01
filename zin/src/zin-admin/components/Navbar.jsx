import { Button } from "@/components/ui/button";
import { useAdminAuth } from "../context/AdminAuthProvider";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, logout, signUp } = useAdminAuth();

  return (
    <nav className="flex items-center max-w-[1100px] mx-auto justify-around border-b border-dark-4 p-2  ">
      <div className="logo">
        <img src="/icons/navbar.svg" className="w-11" />
      </div>
      <div className="tabs">
        {isAuthenticated ? (
          <Button className="text-pink-200" onClick={logout}>
            Logout
          </Button>
        ) : signUp ? (
          <>
            <Link to="/admin/login" className="mx-2">
              <Button className="text-pink-200">Login</Button>
            </Link>
            <Link to="/admin/signup" className="mx-2">
              <Button className="text-pink-200">Signup</Button>
            </Link>
          </>
        ) : (
          <Link to="/admin/login" className="mx-2">
            <Button className="text-pink-200">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
