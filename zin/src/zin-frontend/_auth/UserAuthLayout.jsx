import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthProvider";

const UserAuthLayout = () => {
  const { isUserAuthenticated } = useUserAuth();
  return (
    <>
      {!isUserAuthenticated ? (
        <div className="w-full h-full flex items-center justify-center max-sm:w-full">
          <Outlet />
        </div>
      ) : (
        <Navigate to={`/`} />
      )}
    </>
  );
};

export default UserAuthLayout;
