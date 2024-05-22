import express from "express";
import { validationResult, checkSchema } from "express-validator"
import AuthMiddleware from "@/middleware/Auth.js";
import { IUserAuthRequest, IS_PUBLIC } from "@/definitions.js";
import { AppDataSource } from "@/datasource.js";
import { File } from "@/models/File.js";

const router = express.Router();
router.use(AuthMiddleware);

const togglePublicRequestValidation = {
	fileId: {
		notEmpty: true,
		isInt: true
	},
	public: {
		notEmpty: true,
		isInt: true,
		isIn: {
			options: [[IS_PUBLIC.YES, IS_PUBLIC.NO]],
			errorMessage: "Public should be 1 or 0"
		}
	}
}

/**
 * Toggle public property of file
 */
router.post('/set-public', checkSchema(togglePublicRequestValidation), async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user?.data.id)
		return res.status(403).send();

	const validation = validationResult(req);
	if (validation.array().length)
		return res.status(422).send(validation.array().shift())

	try {
		const repo = AppDataSource.getRepository(File);
		const file = await repo.createQueryBuilder()
			.where('user_id = :userId', {userId: req.user?.data.id})
			.andWhere('id = :fileId', {fileId: req.body.fileId})
			.getOne();

		if(!file)
			return res.status(404).send();

		file.public = req.body.public;

		await repo.save(file);
		return res.status(200).send();
	} catch (error) {
		console.error(error);

		return res.status(500).send();
	}

})

export default router;
