import express from "express";
import multer from 'multer';
import { validationResult, checkSchema } from "express-validator"
import AuthMiddleware from "@/middleware/Auth.js";
import { IUserAuthRequest } from "@/definitions.js";
import { Files } from "@/lib/FilesHelper.js";
import sanitizeHtml from 'sanitize-html';
import { randomBytes } from "crypto";
import { PathLike } from "fs";

const router = express.Router();
const upload = multer({ dest: 'uploads/' })
/**
 * Upload File
 */
router.post('/upload', AuthMiddleware, upload.single('file'), async(req: IUserAuthRequest, res: express.Response) => {

	if(!req.user)
		return res.status(403).send("Unauthorized");

	if(!req.file)
		return res.status(422).send("File not uploaded");

	try {

		if(!(await Files.moveUploadedFile(req.file, req.user)))
			return res.status(500).send("File was not copied correctly");

		const file = await Files.saveInDatabase(req.file, req.user?.data.id, req.body?.parentId);
		if(!file)
			return res.status(500).send("File not saved correctly");

		return res.send({success: true, file});

	} catch (error) {
		console.log('UploadFIleError', error);
		return res.status(500).send({success: false});
	}

})

/**
 * Create folder
 */
const createFolderRequestValidator = {
	name: {
		isString: true,
		notEmpty: true,
		matches: {
			options: /^[a-zA-Z0-9_-]+$/,
			errorMessage: 'Only Alphanumeric charasters, underscore & dash are allowed'
		}
	},
	parentId: {
		optional: true,
		matches: {
			options: /^[0-9]+$/,
			errorMessage: 'Parent ID should be either number or empty value'
		}
	}
}

router.post('/create-folder', checkSchema(createFolderRequestValidator), AuthMiddleware, async(req: IUserAuthRequest, res: express.Response) => {
	if (!req.user)
		return res.status(403).send("Unauthorized");

		const validation = validationResult(req);
		if (validation.array().length)
			return res.status(422).send(validation.array().shift())

		Files.createFolder(req.body.name, Number(req.user?.data?.id),  req.body.parentId).then(folder => {
			return res.send(folder);
		}).catch(err => {
			res.status(500).send({message: "Error occured, please try again later"});
		})
})


/**
 * Add text file
 */
const createTextFileRequestValidator = {
	name: {
		isString: true,
		notEmpty: true,
		matches: {
			options: /^[a-zA-Z0-9_-]+$/,
			errorMessage: 'Only Alphanumeric charasters, underscore & dash are allowed'
		}
	},
	parentId: {
		optional: true,
		matches: {
			options: /^[0-9]+$/,
			errorMessage: 'Parent ID should be either number or empty value'
		}
	},
	text: {
		isString: true,
		customSanitizer: {
			options: (async (value: string) => sanitizeHtml(value))
		}
	}
}
router.post('/text',  checkSchema(createTextFileRequestValidator), AuthMiddleware, async(req: IUserAuthRequest, res: express.Response) => {
	if(!req.user)
		return res.status(403).send("Unauthorized");

	const validation = validationResult(req);
	if(validation.array().length)
		return res.status(422).send(validation.array().shift())

	const filename = randomBytes(16).toString('hex');
	let filePath = '' as PathLike;
	try {
		filePath = await Files.createTextFile(req.user.data.id, filename, req.body.text);
		const stats = await Files.getFileStats(filePath);
		const parentId =  req.body.parentId ? req.body.parentId : null;
		const file = {
			mimetype: 'text/html',
			originalname: req.body.name,
			filename,
			size: stats.size
		} as unknown as Express.Multer.File;

		const uploadedFile = await Files.saveInDatabase(file, req.user.data.id, parentId);
		return res.send(uploadedFile);
	} catch (error) {
		if(filePath.toString().length && await Files.exists(filePath))
			Files.removeFIle(filePath);

		return res.status(500).send({message: 'An error occurred. Please try again later.'});
	}
})


export default router;
