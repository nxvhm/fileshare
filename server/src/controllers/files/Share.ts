import express from "express";
import { validationResult, checkSchema } from "express-validator"
import AuthMiddleware from "@/middleware/Auth";
import { IUserAuthRequest } from "@/definitions";
import { Files } from "@/lib/FilesHelper";
import { File } from "@/models/File";
import { User } from "@/models/User";
import { Share } from "@/models/Share";
import { AppDataSource } from "@/datasource";

const router = express.Router();
router.use(AuthMiddleware);

const shareFileRequestValidation = {
	userId: {
		notEmpty: true,
		matches: {
			options: /^[0-9]+$/,
			errorMessage: 'Invalid user provided'
		}
	},
	fileId: {
		notEmpty: true,
		matches: {
			options: /^[0-9]+$/,
			errorMessage: 'Invalid user provided'
		}
	}
}

router.post('/share', checkSchema(shareFileRequestValidation), async(req: IUserAuthRequest, res: express.Response) => {
	if (!req.user)
		return res.status(403).send("Unauthorized");

	const validation = validationResult(req);
	if (validation.array().length)
		return res.status(422).send(validation.array().shift())

	try {
		const usersRepo = AppDataSource.getRepository(User);
		const filesRepo = AppDataSource.getRepository(File);
		const shareRepo = AppDataSource.getRepository(Share);

		if (!await usersRepo.findOneBy({id: req.body.userId}))
			return res.status(404).send("User cannot be found");

		if (!await filesRepo.findOneBy({id: req.body.fileId, user_id: req.user?.data.id}))
			return res.status(404).send("File cannot be found");

		if (await shareRepo.findOneBy({file_id: req.body.fileId, user_id: req.body.userId}))
			return res.status(422).send("File is already shared with that user");

		const shareRecord = new Share();
		shareRecord.file_id = req.body.fileId;
		shareRecord.user_id = req.body.userId;

		await shareRepo.save(shareRecord);

		const shareRecordSaved = await shareRepo.findOne({
			where: {
				user_id: shareRecord.user_id,
				file_id: shareRecord.file_id
			},
			select: {
				user: {
					name: true
				}
			},
			relations: {
				user: true
			}
		});

		return res.status(200).send(shareRecordSaved);

	} catch (error) {
		console.error(error);
		return res.status(500).send("Error during share. Please try again later");
	}

})

router.delete('/share/delete', checkSchema(shareFileRequestValidation), async(req: IUserAuthRequest, res: express.Response) => {
	if (!req.user)
		return res.status(403).send("Unauthorized");

	const validation = validationResult(req);
	if (validation.array().length)
		return res.status(422).send(validation.array().shift())

	try {

		const filesRepo = AppDataSource.getRepository(File);
		const shareRepo = AppDataSource.getRepository(Share);

		if (!await filesRepo.findOneBy({id: req.body.fileId, user_id: req.user?.data.id}))
			return res.status(401).send("Unauthorized");

		if (!await shareRepo.findOneBy({file_id: req.body.fileId, user_id: req.body.userId}))
			return res.status(422).send("Invalid data");

		await AppDataSource.createQueryBuilder().delete().from(Share).where({
			file_id: req.body.fileId,
			user_id: req.body.userId
		}).execute();

		return res.status(200);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Error during share. Please try again later");

	}

});

const fileSharesRequestValidation = {
	fileId: {
		notEmpty: true,
		matches: {
			options: /^[0-9]+$/,
			errorMessage: 'Invalid file id'
		}
	}
}
router.get('/shares', checkSchema(fileSharesRequestValidation), async(req: IUserAuthRequest, res: express.Response) => {

	const validation = validationResult(req);
	if (validation.array().length)
		return res.status(422).send(validation.array().shift())

	const shares = await AppDataSource.getRepository(Share).createQueryBuilder('shares')
		.select(['shares.user_id', 'shares.file_id', 'shares.created_at', 'user.name', 'user.id'])
		.innerJoin('shares.file', 'file')
		.innerJoin('shares.user', 'user')
		.where('file.id = :fileId', {fileId: req.query.fileId})
		.andWhere('file.user_id = :userId', {userId: req.user?.data.id})
		.getMany();

	return res.send(shares);
})

export default router;
