import { createContext } from "react";
import { UserTokenData } from "../Token";

export type AuthContextData = {
	user: UserTokenData|null,
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
