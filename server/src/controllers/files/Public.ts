import express from "express";
import { validationResult, checkSchema } from "express-validator"
import AuthMiddleware from "@/middleware/Auth.js";
import { IUserAuthRequest } from "@/definitions.js";
import { AppDataSource } from "@/datasource.js";
import { File } from "@/models/File.js";

const router = express.Router();
router.use(AuthMiddleware);

const togglePublicRequestValidation = {
	fileId: {
		notEmpty: true,
		matches: {
			options: /^[0-9]+$/,
			errorMessage: 'Invalid File provided',
		}
	},
	public: {
		notEmpty: true,
		isBoolean: true
	}
}


/**
 * Toggle public property of file
 */
router.post('/set-public', checkSchema(togglePublicRequestValidation), async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user?.data.id)
		return res.status(403).send();

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
