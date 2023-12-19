import express from "express";
import { validationResult, checkSchema } from "express-validator"
import { AppDataSource } from "../datasource";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import {TokenManager} from "../lib/TokenManager";
const router = express.Router();

const signupRequestValidator = {
	name: {
		isString: true,
		notEmpty: true,
		isLength: {
			options: {min: 3},
			errorMessage: "Name should be minimum 3 letters"
		}
	},
	email: {
		isEmail: true
	},
	password: {
		notEmpty: true,
		isLength: {
			options: {min: 6, max: 18},
			errorMessage: "Password should be between 6 and 18 characters"
		}
	}
}

router.post('/signup', checkSchema(signupRequestValidator), async (req: express.Request, res: express.Response) => {
	try {
		const validation = validationResult(req);

		if (validation.array().length)
			return res.status(422).send(validation.array().shift())

		const user = new User(),
					userRepo = AppDataSource.getRepository(User),
					exists = await userRepo.createQueryBuilder().where('email = :email', {email: req.body.email}).getExists();

		if (exists)
			return res.status(422).send({message: "Email already taken"});

		user.name = req.body.name;
		user.email = req.body.email;
		user.password = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_ROUNDS));
		await userRepo.save(user);

		res.send({message: "Signup successfull"});
	} catch (error) {
		console.error(error);
		res.status(500).send({message: "Error during signup"});
	}
})

const loginRequestValidator = {
	email: {
		isEmail: true
	},
	password: {
		notEmpty: true,
		isLength: {
			options: {min: 6, max: 18},
			errorMessage: "Password should be between 6 and 18 characters"
		}
	}
}

router.post('/login', checkSchema(loginRequestValidator), async (req: express.Request, res: express.Response) => {
	const validation = validationResult(req);

	if (validation.array().length)
		return res.status(422).send(validation.array().shift())

	try {
		const userRepo = AppDataSource.getRepository(User);
		const user = await userRepo.findOne({
			select: {id: true, email: true, name: true, password: true},
			where: {email: req.body.email}
		})

		if (!user)
			return res.status(422).send({message: "Invalid email/password combination"});

		const match = await bcrypt.compare(req.body.password, user.password);

		if(!match)
			return res.status(422).send({message: "Invalid email/password combination"});

		const token = await TokenManager.signUserToken(user.getTokenPayload());

		return res.status(200).send({token});
	} catch (error) {
		return res.status(500).send({message: "Error during login, please try again late"});
	}
})

router.post('/verify', async(req: express.Request, res: express.Response) => {
	const token = req.body.token;
	if(!token)
		res.status(422).send({message: "Token not provided"});

	const isValid = await TokenManager.verifyToken(token);
	console.log("ctrl, isValid:", isValid);
	res.send({isValid});
})

export default router;
