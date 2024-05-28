import express from "express";
import AuthMiddleware from '@/middleware/Auth.js';
import { IUserAuthRequest } from '@/definitions.js';
import { AppDataSource } from '@/datasource.js';
import { File } from '@/models/File.js';
import { Files } from '@/lib/FilesHelper.js';
import { TokenManager } from "@/lib/TokenManager.js";

const router = express.Router();

router.get('/download/:hash', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
	return res.status(403).send("Unauthorized");

	if(!req.params.hash)
		return res.status(422).send("No valid file found");

	const file = await AppDataSource.getRepository(File).findOne({
		where: {hash: req.params.hash }
	});

	if(!file)
		return res.status(404).send("File not found");

	const filePath = file.getPath();
	const exists = await Files.exists(filePath);

	if(!exists)
		return res.status(404).send("File not found");

	return res.download(String(filePath), err => {
		console.error(err);
	});
})

router.get('/view/:hash/:token?', async(req: express.Request, res: express.Response) => {
	if (!req.params.hash)
		return res.status(404).send("File not found");

	const file = await AppDataSource.getRepository(File).findOne({
		where: {hash: req.params.hash }
	});

	if (!file || (!file.public && !req.params.token))
		return res.status(404).send("File not found");

	if (file.public && Files.isViewable(file))
		return res.contentType(file.mime).sendFile(String(file.getPath()));

	if(!await TokenManager.isValid(String(req.params.token)))
		return res.status(404).send("File not found");

	const user = await TokenManager.decode(String(req.params.token));
	return file.user_id != user.data.id
		? res.status(404).send("File not found")
		: res.contentType(file.mime).sendFile(String(file.getPath()));
})

export default router
