import express from "express";
import multer from 'multer';
import AuthMiddleware from "../middleware/Auth";
import { IUserAuthRequest } from "../definitions";
import fs from 'fs';
import { sep } from "path";
import path from 'path';
import { Files } from "../lib/Files";

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.use(AuthMiddleware);

router.post('/file', upload.single('file'), async(req: IUserAuthRequest, res: express.Response) => {

	if(!req.user)
		return res.status(403).send("Unauthorized");

	if(!req.file)
		return res.status(422).send("File not uploaded");

	const exists = await Files.exists(req.file.destination);
	if(!exists)
		return res.status(500).send("File not uploaded or not readable");

	const filesDirExists = await Files.exists(Files.getUserFilesDirPath());
	if(!filesDirExists) {
		const filesDirCreated = await Files.mkdir(Files.getUserFilesDirPath());
		if(!filesDirCreated)
			return res.status(500).send("Files directory not available at the moment");
	}

	const copyFile = await Files.copyFile(req.file.path, Files.getUserFilesDirPath(req.file.filename));
	if(!copyFile)
		return res.status(500).send("Error while moving uploaded file");

	return res.send({success: true});

})


export default router;
