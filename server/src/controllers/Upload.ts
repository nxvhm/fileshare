import express from "express";
import Multer from "multer";


const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.post('/file', async(req: express.Request, res: express.Response) => {
	console.log("dasdas");
})


export default router;
