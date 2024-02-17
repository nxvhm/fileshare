import express from "express"
import AuthMiddleware from "../middleware/Auth"
import { IUserAuthRequest } from "../definitions"
import { Files } from "../lib/Files";
const router = express.Router();

router.get('/', [AuthMiddleware], async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
		return res.status(403).send("Unauthorized");

	console.log(req.params, req.user);
	const files = await Files.getUserFiles(req.user?.data.id);
	return res.send(files);

});


export default router;
