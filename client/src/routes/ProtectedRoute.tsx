import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Token } from "../lib/Token";
import { useState, useEffect } from "react";
const ProtectedRoute = ({ children }) => {

	const {user} = useContext(AuthContext);
	const [isValid, setIsValid] = useState(true);

	useEffect(() => {
		Token.verifiToken().then(res => setIsValid(res));
	})

  if (!user || !isValid) {
    return <Navigate to="/login" replace />;
  }

	return children;

};

export default ProtectedRoute
