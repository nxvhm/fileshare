import { Token } from "../lib/Token";
import { useState, useEffect } from "react";
import Layout from "../components/main/Layout";
const ProtectedRoute: React.FC<React.PropsWithChildren> = ({children}) => {

	const [isValid, setIsValid] = useState<undefined | boolean>(undefined);

	useEffect(() => {
		Token.verifiToken().then(res => setIsValid(res));
	})

	useEffect(() => {
		if(typeof isValid == 'undefined')
			return;

		if(isValid)
			return;

		Token.remove();
		window.location.href = '/login';
	}, [isValid]);

	return <Layout>{children}</Layout>;

};

export default ProtectedRoute
