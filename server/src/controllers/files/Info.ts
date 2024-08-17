import express from "express"
import { AppDataSource } from '@/datasource.js';
import { File } from '@/models/File.js';
import { IS_PUBLIC } from "@/definitions.js";
import AuthMiddleware from "@/middleware/Auth.js";
import { IUserAuthRequest } from "@/definitions.js";

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

	return res.send(textFile);
})

export default router;
