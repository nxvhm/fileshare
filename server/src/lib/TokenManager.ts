import jwt from "jsonwebtoken"

export type UserTokenPayload = {
	id: number,
	name: string,
	email: string
}

export class TokenManager {
	static signUserToken(userData: UserTokenPayload): string {
		const token = jwt.sign(userData, String(process.env.JWT_SECRET), {expiresIn: 3600});
		return token;
	}
}
