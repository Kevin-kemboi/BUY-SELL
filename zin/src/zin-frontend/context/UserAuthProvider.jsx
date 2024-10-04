import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { confirmUser } from "@/lib/api/api";

const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [userEmail, setUserEmail] = useState();


  const confirmAuth = async () => {
    const token = localStorage.getItem("UserCookie");
    const value = await confirmUser(token);
    if (value.success) {
      setIsUserAuthenticated(true);
      setUser(value.user._id)

      return true;
    }
    setIsUserAuthenticated(false);
  };

  const userLogout = () => {
    localStorage.removeItem("UserCookie");
    setIsUserAuthenticated(false);
  };

  useEffect(() => {
    confirmAuth();
  }, []);

  const value = {
    user,
    isUserAuthenticated,
    setIsUserAuthenticated,
    confirmAuth,
    userLogout,
    setUserEmail,
    userEmail
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
