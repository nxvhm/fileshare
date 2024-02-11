import express from "express";
import multer from 'multer';
import AuthMiddleware from "./../middleware/Auth";
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

	try {

		const fileMoved = await Files.moveUploadedFile(req.file);
		const saved = await Files.saveInDatabase(req.file, req.user?.id, null);

		return res.send({success: true});

	} catch (error) {
		return res.status(500).send(error);
	}

})


export default router;
