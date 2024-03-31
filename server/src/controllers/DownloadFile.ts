import express from "express";
import AuthMiddleware from "../middleware/Auth";
import { IUserAuthRequest } from "../definitions";
import { AppDataSource } from "../datasource";
import { File } from "../models/File";
import { Files } from "../lib/FilesHelper";
const router = express.Router();

router.get('/:hash', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
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

export default router
