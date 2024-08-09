import express from "express";
import AuthMiddleware from "@/middleware/Auth.js";
import { IUserAuthRequest } from "@/definitions.js";
import { AppDataSource } from "@/datasource.js";
import { File } from '@/models/File.js';
import { Files } from '@/lib/FilesHelper.js';
const router = express.Router();

router.post('/delete', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {

	if(!req.user)
		return res.status(403).send("Unauthorized");

	if(!req.body.id)
		return res.status(422).send("No valid file id found");

	try {
		const file = await AppDataSource.getRepository(File).findOne({
			where: {
				id: req.body.id,
				user_id: req.user.data.id
			}
		});

		if(!file)
			return res.status(404).send("File not found");

		const filePath = file.getPath();
		const exists = await Files.exists(filePath);

		await AppDataSource.createQueryBuilder()
			.delete()
			.from(File)
			.where("id = :id", {id: file.id})
			.execute();

		if(exists)
			await Files.removeFIle(filePath);

	} catch (error) {
		console.error(error);
		return res.status(500).send({success: false});
	}

	return res.status(200).send({success: true});

});

router.post('/delete/multiple', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
	try {

		if(!req.user)
			return res.status(403).send("You are not authorized to perform this action");

		if(!req.body.files)
			return res.status(422).send("No files provided");

		const filesToRemove = await AppDataSource
			.getRepository(File)
			.createQueryBuilder('f')
			.select(['f.id', 'f.name', 'f.user_id', 'f.hash'])
			.where('f.id IN (:...ids)', {ids: req.body.files})
			.andWhere('f.user_id = :userId', {userId: req.user?.data.id})
			.getMany();

		for(let file of filesToRemove) {
			const path = file.getPath();
			if(await Files.exists(path))
				await Files.removeFIle(path);
		}

		await AppDataSource.createQueryBuilder()
			.delete()
			.from(File)
			.where("id IN (:...ids)", {ids: req.body.files})
			.andWhere('user_id = :userId', {userId: req.user?.data.id})
			.execute();

		return res.send();
	} catch (e) {
		console.error(e);
		return res.status(500).send('Error during file deletion, please try again later');
	}
})

export default router;
