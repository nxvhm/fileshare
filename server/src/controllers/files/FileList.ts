import express from "express"
import AuthMiddleware from "@/middleware/Auth.js"
import { IUserAuthRequest } from "@/definitions.js"
import { Files } from "@/lib/FilesHelper.js";
const router = express.Router();

router.get('/list/:parentId?', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
		return res.status(403).send("Unauthorized");

	const parentId = req.params.parentId ? Number(req.params.parentId) : undefined;
	console.log("Params are:", req.params.hash);
	const files = await Files.getUserFiles(req.user?.data.id, parentId);
	return res.send(files);
});

export default router;
