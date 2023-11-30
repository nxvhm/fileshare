import express from "express";
import { validationResult, checkSchema } from "express-validator"

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
			options: {min: 8, max: 18},
			errorMessage: "Password should be between 6 and 18 characters"
		}
	}
}

router.post('/signup', checkSchema(signupRequestValidator), (req: express.Request, res: express.Response) => {
	const validation = validationResult(req);

	if(validation.array().length)
		return res.status(422).send(validation.array().shift())

	console.log(req.body, validation.array().shift());
	res.send(req.body);
})

router.post('/login', (req: express.Request, res: express.Response) => {

})

export default router;
