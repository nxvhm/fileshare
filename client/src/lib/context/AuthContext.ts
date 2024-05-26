import { createContext } from "react";
import { AuthTokenPayload } from "../../definitions";

export type AuthContextData = {
	user: AuthTokenPayload|null,
	loginUser: null|((token:string) => void),
	logoutUser: () => void
}

const initContext = ():AuthContextData => {
	return {
		user: null,
		loginUser: null,
		logoutUser: () => {}
	}
}

const AuthContext = createContext(initContext())

export default AuthContext
