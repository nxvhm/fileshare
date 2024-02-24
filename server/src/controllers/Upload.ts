import express from "express";
import multer from 'multer';
import AuthMiddleware from "./../middleware/Auth";
import { IUserAuthRequest } from "../definitions";
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

		if(!(await Files.moveUploadedFile(req.file, req.user)))
			return res.status(500).send("File was not copied correctly");

		const file = await Files.saveInDatabase(req.file, req.user?.data.id, null);
		if(!file)
			return res.status(500).send("File not saved correctly");

		return res.send({success: true, file});

	} catch (error) {
		console.log('UploadFIleError', error);
		return res.status(500).send({success: false});
	}

})


export default router;
