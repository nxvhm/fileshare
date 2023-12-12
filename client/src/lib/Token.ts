import { isExpired, decodeToken } from "react-jwt";

export type UserTokenData = {
 id: number,
 name: string,
 email: string
}

export class Token {

	public static set(token:string): void {
		localStorage.setItem('token', token);
	}

	public static get(): string|null {
		return localStorage.getItem('token');
	}

	public static remove(): void {
		localStorage.removeItem('token');
	}

	public static has(): boolean {
		return Boolean(Token.get());
	}

	public static isExpired(): boolean {
		return isExpired(Token.get() ?? "");
	}

	public static getData(): UserTokenData|null {
		if (Token.isExpired())
			return null

		return decodeToken(Token.get() ?? "");
	}

}

