import jwt from "jsonwebtoken"
import { UserToken } from "../models/UserToken";
import { AppDataSource } from "../datasource";
export type UserTokenPayload = {
	id: number,
	name: string,
	email: string
}

export class TokenManager {
	static async signUserToken(userData: UserTokenPayload): Promise<string> {
		const userToken = new UserToken();
		const tokenRepo = AppDataSource.getRepository(UserToken);
		const expiresAt = Math.floor(Date.now() / 1000) + (60 * 60);
		const token = jwt.sign(
			{data: userData, exp: expiresAt},
			String(process.env.JWT_SECRET)
		);

		userToken.user_id = userData.id;
		userToken.token = token;
		userToken.expires_at = new Date(expiresAt*1000).toISOString().slice(0, 19).replace('T', ' ');
		await tokenRepo.save(userToken);

		return token;
	}
}
