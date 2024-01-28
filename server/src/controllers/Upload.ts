import express from "express";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.post('/file', upload.single('file'), async(req: express.Request, res: express.Response) => {
	console.log("dasdas", req.file);
})


export default router;
