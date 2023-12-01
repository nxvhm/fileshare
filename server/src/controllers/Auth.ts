import express from "express";
import { validationResult, checkSchema } from "express-validator"
import { AppDataSource } from "../datasource";
import { User } from "../models/User";
import bcrypt from "bcrypt";

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

router.post('/login', (req: express.Request, res: express.Response) => {

})

export default router;
