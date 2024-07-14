import { createContext, useContext, useEffect, useState } from "react";
import { confirmAdmin, getAdmins } from "../lib/api/api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signUp, setSignUp] = useState(false)
  const navigate = useNavigate();

  const confirmAuth = async () => {
    const token = localStorage.getItem("Cookie");
    const value = await confirmAdmin(token);
    if (value) {
      setIsAuthenticated(true);
      return true;
    }
    setIsAuthenticated(false);
  };

  const adminCount = async () => {
    const count = await getAdmins();
    if(count.adminCount === 0){
      setSignUp(true);
      return true;
    }
    setSignUp(false);
  }

  const logout = () => {
    localStorage.removeItem("Cookie");
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  useEffect(() => {
    adminCount();
    const token = localStorage.getItem("Cookie");
    if (!token) {
      navigate('/admin/login')
    } else {
      confirmAuth();
    }
  }, []);

  const value = { setIsAuthenticated, 
    isAuthenticated, 
    confirmAuth, 
    logout, 
    signUp,
    setSignUp

  
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminAuthProvider;

export const useAdminAuth = () => useContext(AuthContext);
