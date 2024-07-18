import express from "express"
import { AppDataSource } from '@/datasource.js';
import { File } from '@/models/File.js';
import { Files } from "@/lib/FilesHelper.js";
import { IS_PUBLIC } from "@/definitions.js";

const router = express.Router();
router.get('/info/:hash', async(req: express.Request, res: express.Response) => {
	if(!req.params.hash)
		return res.status(422).send("No valid file found");

	const file = await AppDataSource.getRepository(File).findOne({
		where: {
			hash: req.params.hash,
			public: IS_PUBLIC.YES
		}
	});

	if (!file)
		return res.status(404).send();

	return res.send(file);
})

export default router;
