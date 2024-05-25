import express from "express";
import { validationResult, checkSchema, Schema, CustomValidator } from "express-validator"
import bcrypt from "bcrypt";
import AuthMiddleware from "../middleware/Auth.js";
import { IUserAuthRequest } from "../definitions.js";
import { User } from "@/models/User.js";
import { AppDataSource } from "@/datasource.js";
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

const repeatPasswordValidator: CustomValidator = (v, {req}) => {
	return v == req.body.newPassword

}
const profileUpdateValidator = {
	name: {
		isString: true,
		notEmpty: false,
		isLength: {
			options: {min: 3},
			errorMessage: "Name should be minimum 3 letters"
		}
	},
	email: {
		optional: true,
		isEmail: true
	},
	password: {
		notEmpty: true,
		isLength: {
			options: {min: 6, max: 18},
			errorMessage: "Password should be between 6 and 18 characters"
		}
	},
	newPassword: {
		optional: true,
		isLength: {
			options: {min: 6, max: 18},
			errorMessage: "New Password should be between 6 and 18 characters"
		},
		custom: {
			options: (v: string) => {
				return true
			}
		}
	},
	rePassword: {
		optional: true,
		custom: {
			options: repeatPasswordValidator,
			errorMessage: "Repeated New Password doest not match"
		}
	}
}
router.put('/profile',  checkSchema(profileUpdateValidator), async(req: IUserAuthRequest, res: express.Response) => {

	if (!req.user)
		return res.status(401).send();

	const validation = validationResult(req);
	if (validation.array().length)
		return res.status(422).send(validation.array().shift())

	const userRepo = AppDataSource.getRepository(User);
	const user = await userRepo.findOne({
		select: {id: true, email: true, name: true, password: true},
		where: {id: req.user.data.id}
	})

	if (!user)
		return res.status(401).send();

	const match = await bcrypt.compare(req.body.password, user.password);
	if (!match)
		return res.status(422).send({msg: 'Invalid password provided'});

	if (req.body.name && user.name != req.body.name)
			user.name = req.body.name;

	if (req.body.email && user.email != req.body.email)
			user.email = req.body.email;

	if (! await userRepo.save(user))
			res.status(500).send({msg: 'Error Updating User Profile'});

	return res.send();

})

export default router;
