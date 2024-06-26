import { useEffect, useState } from "react";
import {Token} from "../Token";
import {AuthContextData} from "../context/AuthContext";
import { AuthTokenPayload } from "../../definitions";

export function useAuth():AuthContextData {
	const [user, setUser] = useState<AuthTokenPayload|null>(null);

	useEffect(
		() => setUser(Token.getData()),
		[Token.isExpired()]
	);

	const loginUser = (token:string): void => {
		Token.set(token);
		console.log(token, Token.getData());
		setUser(Token.getData());
	}

	const logoutUser = (): void => {
		setUser(null);
		Token.remove();
	}

	return {user, loginUser, logoutUser}
}
