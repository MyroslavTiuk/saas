import {Outlet, Navigate} from "react-router";
import {isSignIn} from "../utils/helper";

const ProtectedRoutes = () => {
  let isAuth = isSignIn();
  return isAuth ? <Outlet/> : <Navigate to="/login"/>;
};

export default ProtectedRoutes;
