import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { confirmUser } from "@/lib/api/api";

const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const confirmAuth = async () => {
    const token = localStorage.getItem("UserCookie");
    const value = await confirmUser(token);
    if (value) {
      setIsUserAuthenticated(true);
      return true;
    }
    setIsUserAuthenticated(false);
  };

  const userLogout = () => {
    localStorage.removeItem("Cookie");
    setIsUserAuthenticated(false);
  };

  useEffect(() => {
    confirmAuth();
  }, []);

  const value = {
    isUserAuthenticated,
    setIsUserAuthenticated,
    confirmAuth,
    userLogout,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

UserAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserAuthProvider;

export const useUserAuth = () => useContext(UserAuthContext);
