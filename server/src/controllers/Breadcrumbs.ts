import express from "express"
import AuthMiddleware from "../middleware/Auth"
import { IUserAuthRequest } from "../definitions"
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

	const folderHierarchy = await AppDataSource.createQueryRunner().manager.query(`
		WITH RECURSIVE cte (id, name, parent_id) AS (
			SELECT id, name, parent_id
			FROM files
			WHERE parent_id = ? AND type = 'folder' AND user_id = ?
			UNION ALL
				SELECT f.id, f.name, f.parent_id
				FROM files f
				INNER JOIN cte ON f.id = cte.parent_id
		) select * from cte;
	`, [folder.parent_id, req.user?.data.id]);

	const result = folderHierarchy.sort((a: File, b: File) => a.id < b.id ? -1 : 1);
	return res.send(result);
});


/**

 */

export default router;
