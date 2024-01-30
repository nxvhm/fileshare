import express from "express";
import multer from 'multer';
import AuthMiddleware from "../middleware/AUth";
import { IUserAuthRequest } from "../definitions";

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.use(AuthMiddleware);

router.post('/file', upload.single('file'), async(req: IUserAuthRequest, res: express.Response) => {
	console.log("dasdas", req.user);
	res.send({success: true});
})


export default router;
