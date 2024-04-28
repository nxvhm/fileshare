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

export default router;
