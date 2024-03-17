import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Token } from "../lib/Token";
import { useState, useEffect } from "react";
import Layout from "../components/main/Layout";
const ProtectedRoute: React.FC<React.PropsWithChildren> = ({children}) => {

	const {user} = useContext(AuthContext);
	const [isValid, setIsValid] = useState(true);

	useEffect(() => {
		Token.verifiToken().then(res => setIsValid(res));
	})

  if (!user || !isValid) {
    return <Navigate to="/login" replace />;
  }

	return <Layout>{children}</Layout>;

};

export default ProtectedRoute
