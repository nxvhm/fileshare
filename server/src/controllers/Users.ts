import express from "express";
import { validationResult, checkSchema, Schema } from "express-validator"
import AuthMiddleware from "../middleware/Auth";
import { IUserAuthRequest } from "../definitions";
import { Files } from "../lib/FilesHelper";
import { User } from "@/models/User";
import { AppDataSource } from "@/datasource";
import { Like } from "typeorm";

const router = express.Router();

router.use(AuthMiddleware);

const searchUsersValidator: Schema = {
	term: {
		isString: true,
		isLength: {
			options: {
				min: 3
			}
		},
		notEmpty: true,
	}
}
router.get('/search', checkSchema(searchUsersValidator), async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
		return res.status(403).send("Unauthorized");

	const validation = validationResult(req);

	if (validation.array().length)
		return res.status(422).send(validation.array().shift())

	const repo = AppDataSource.getRepository(User)
	const users = await repo.find({
		select: ['id', 'name', 'email'],
		where: [
			{name: Like(`%${req.query.term}%`)},
			{email: Like(`%${req.query.term}%`)},
		]
	});



	return res.send(users);

})

export default router;
