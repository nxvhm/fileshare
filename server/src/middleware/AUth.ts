import express from "express";
import { TokenManager } from "../lib/TokenManager";
import { IUserAuthRequest } from "../definitions";

const AuthMiddleware = async (req: IUserAuthRequest, res: express.Response, next: express.NextFunction) => {

	if(req.method == "OPTIONS")
		return next();

	if(!req.get("Authorization"))
		return res.status(403).send("Unauthorized");

	try {
		const token = req.get("Authorization")?.split(" ")[1];
		const isValid = await TokenManager.isValid(String(token));

		if(!isValid)
			return res.status(403).send("Unauthorized");

		req.user = await TokenManager.decode(String(token));

		return next();

	} catch (error) {
		console.error("AuthMiddleware error:", error);
		return res.status(403).send("Unauthorized");
	}
}

export default AuthMiddleware
