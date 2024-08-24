import express from "express"
import AuthMiddleware from '@/middleware/Auth.js'
import { IUserAuthRequest } from "@/definitions.js"
import { AppDataSource } from "@/datasource.js";
import { File } from "@/models/File.js";

const router = express.Router();

router.get('/breadcrumbs', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
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

	const folderHierarchy = await AppDataSource.manager.query(`
		WITH RECURSIVE cte (id, name, parent_id) AS (
			SELECT 	id,
							name,
							parent_id
			FROM 		files
			WHERE 	id = ?
			AND type = 'folder'
			AND user_id = ?
			UNION ALL
				SELECT 	f.id,
								f.name,
								f.parent_id
				FROM 		files f
				INNER JOIN cte
					ON f.id = cte.parent_id AND f.type = 'folder'
		) select * from cte;`, [folderId, req.user?.data.id]);
	return res.send(folderHierarchy.reverse());
});


/**

 */

export default router;
