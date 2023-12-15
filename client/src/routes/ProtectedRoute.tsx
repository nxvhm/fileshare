import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../lib/context/AuthContext";
const ProtectedRoute = ({ children }) => {

	const {user} = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute
