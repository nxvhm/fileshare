import express from "express"
import AuthMiddleware from "../middleware/Auth"
import { IUserAuthRequest } from "../definitions"
import { Files } from "../lib/Files";
import { AppDataSource } from "../datasource";
import { File } from "../models/File";
const router = express.Router();

router.get('/', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
		return res.status(403).send("Unauthorized");

	const folderId = req.query.folderId ? Number(req.query.folderId) : undefined;
	if(!folderId)
		return res.send([]);

	const folder = await AppDataSource.getRepository(File).findOne({
		select: ['name', 'parent_id', 'id'],
		where: {id: folderId}
	});

	if(!folder?.parent_id)
		return res.send([folder]);

	const query = AppDataSource
		.createQueryBuilder()
		.from(File, 'file')
		.select(['file.id', 'file.name', 'file.hash'])
		.where('file.id = :parentId', {parentId: folder.parent_id})
		.andWhere('file.type = "folder"');

	const navigation = await query.getMany();

	console.log("NAVIGATION", navigation);

	return res.send(navigation);
});

export default router;
