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


	const __dirname = path.resolve();
	const filesDir = __dirname+sep+"files";

	const exists = await Files.exists(req.file.destination);
	if(!exists)
		return res.status(500).send("File not uploaded or not readable");

	const filesDirExists = await Files.exists(Files.getUserFilesDirPath());
	if(!filesDirExists) {
		const filesDirCreated = await Files.mkdir(Files.getUserFilesDirPath());
		if(!filesDirCreated)
			return res.status(500).send("Files directory not available at the moment");
	}

	const source = fs.createReadStream(req.file.path);
	const dest = fs.createWriteStream(filesDir+sep+req.file.filename);

	source.pipe(dest);
	source.on('end', function() {
		return res.send({success: true});
	});

	source.on('error', function(err) {
		console.log(err);
		return res.status(500).send("Error while moving uploaded file");
	});

	console.log(req.user, req.file, __dirname);


})


export default router;
