import express from "express"
import { AppDataSource } from '@/datasource.js';
import AuthMiddleware from "@/middleware/Auth.js";
import { File } from '@/models/File.js';
import { Files } from "@/lib/FilesHelper.js";
import { IS_PUBLIC, IUserAuthRequest } from "@/definitions.js";

const router = express.Router();
router.get('/info/:hash', async(req: express.Request, res: express.Response) => {
	if(!req.params.hash)
		return res.status(422).send("No valid file found");

	const file = await AppDataSource.getRepository(File).findOne({
		select: {
			user: {
				name: true,
				id: true
			}
		},
		where: {
			hash: req.params.hash,
			public: IS_PUBLIC.YES
		},
		relations: {
			user: true
		}
	});

	if (!file)
		return res.status(404).send();

	return res.send(file);
})


router.get('/text/:id', AuthMiddleware, async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.params.id)
		return res.status(400).send("No valid file found");

	if(!req.user)
		return res.status(403).send("Unauthorized");

	const textFile = await AppDataSource.getRepository(File).createQueryBuilder("file")
		.where('file.id = :id', {id: req.params.id})
		.andWhere('file.user_id = :userId', {userId: req.user.data.id})
		.getOne();

	if(!textFile || !textFile.isText())
		return res.status(404).send({message: 'Text file not found'});

	const textFilePath = textFile.getPath();
	if(!await Files.exists(textFilePath))
		return res.status(404).send({message: 'File not found on the file system'});

	let fileContents = '';
	try {
	 fileContents = await Files.getContents(textFilePath);
	} catch (e) {
		console.error(e);
		return res.status(500).send({message: 'Unable to retrieve file contents'});
	}

	return res.send({...textFile, contents: fileContents});
})

export default router;
