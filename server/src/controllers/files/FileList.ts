import express from "express"
import AuthMiddleware from "@/middleware/Auth.js"
import { IUserAuthRequest } from "@/definitions.js"
import { Files } from "@/lib/FilesHelper.js";
const router = express.Router();

router.get('/list/:parentId?', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
		return res.status(403).send("Unauthorized");

	const parentId = req.params.parentId ? Number(req.params.parentId) : undefined;
	const files = await Files.getUserFiles(req.user?.data.id, parentId);
	return res.send(files);
});

router.get('/shared', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
		return res.status(403).send("Unauthorized");

		const sharedFiles = await Files.getUserSharedFiles(req.user.data.id);

		return res.send(sharedFiles);
});

export default router;
