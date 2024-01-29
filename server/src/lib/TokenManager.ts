import jwt from "jsonwebtoken"
import { UserToken } from "../models/UserToken";
import { AppDataSource } from "../datasource";
import { UserTokenPayload } from "../definitions";

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

	static async isValid(token: string): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			const tokenRepo = AppDataSource.getRepository(UserToken);
			const tokenRecord = await tokenRepo.createQueryBuilder()
				.where("token = :token", {token})
				.getOne();

			if(!tokenRecord)
				reject("Token not found or expired");

			if(new Date() < new Date(String(tokenRecord?.expires_at)))
				reject("Token not found or expired");

			const verified = jwt.verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
				if (err) reject(false);

				resolve(true);
			});
		}).catch(err => {
			return false;
		})

	}

	static decode(token: string): Promise<UserTokenPayload> {
		return new Promise<UserTokenPayload>((resolve, reject) => {
			try {
				jwt.verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
					if(err)
						return reject("Invalid token");

					resolve(decoded as UserTokenPayload);
				});
			} catch (error) {
				reject("Invalid token");
			}
		});
	}
}
