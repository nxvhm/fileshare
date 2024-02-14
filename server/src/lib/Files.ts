import fs, { PathLike } from "fs";
import { sep } from "path";
import path from 'path';
import { File } from "../models/File";
import { AppDataSource } from "../datasource";
import { UserTokenPayload } from "../definitions";

export class Files {

	public static __dirName = path.resolve()
	public static filesDir = process.env.FILES_DIR ? process.env.FILES_DIR : "files";

	public static getUserFilesDirPath(file?: string|PathLike, userId?: number): string|PathLike {
		const path = [
			Files.__dirName,
			Files.filesDir,
		];

		if(userId)
			path.push(String(userId));

		if(file)
			path.push(String(file));

		return path.join(sep);
	}

	public static exists(filePath: string|PathLike): Promise<boolean> {
		return new Promise(async resolve => {
			try {
				await fs.promises.access(filePath, fs.promises.constants.W_OK | fs.promises.constants.R_OK);
				resolve(true);
			} catch (error) {
				console.error(error);
				resolve(false);
			}
		});
	}

	public static mkdir(dir: string|PathLike): Promise<boolean> {
		return new Promise(async resolve => {
			try {
				await fs.promises.mkdir(dir, { recursive: true });
				resolve(true);
			} catch (error) {
				console.error(error);
				resolve(false);
			}
		})
	}

	public static copyFile(sourcePath: string|PathLike, destinationPath: string|PathLike): Promise<boolean> {
		return new Promise(async resolve => {
			try {
				const source = fs.createReadStream(sourcePath);
				const destination = fs.createWriteStream(destinationPath);
				source.pipe(destination);
				source.on('end', () => resolve(true));
				source.on('error', err => {
					console.error("copyFile error", err);
					resolve(false);
				})
			} catch (error) {
				console.error("copyFile error", error);
				resolve(false);
			}
		})
	}

	public static removeFIle(filePath: string|PathLike): Promise<boolean> {
		return new Promise(resolve => {
			fs.unlink(filePath, err => {
				if(!err)
					return resolve(true);

				console.error(err);
				return resolve(false);
			})
		})
	}

	/**
	 * Crete the root directory for the uploaded user files
	 * @returns Promise<boolean> True of dir exists or successfully created, false on error
	 */
	public static createRootDirectory(): Promise<boolean> {
		return new Promise(async resolve => {
			const rootFilesDir = Files.getUserFilesDirPath();
			const filesDirExists = await Files.exists(rootFilesDir);

			if(filesDirExists)
				return resolve(true);

			const filesDirCreated = await Files.mkdir(Files.getUserFilesDirPath());
			if(!filesDirCreated)
				return resolve(false);

			return resolve(true);
		});
	}

	/**
	 * Move user uploaded files to his own directory inside the root files directory
	 * @param file
	 * @param user
	 * @returns Promise<boolean>
	 */
	public static moveUploadedFile(file: Express.Multer.File, user: UserTokenPayload): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			if(!(await Files.exists(file.destination)))
				return reject("File not uploaded or not readable")

			if(!(await Files.createRootDirectory()))
					return reject("Files directory not available at the moment");

			const userDir = Files.getUserFilesDirPath(undefined, user.data.id);
			if(!(await Files.exists(userDir)))
				await Files.mkdir(userDir);

			const copyFile = await Files.copyFile(file.path, Files.getUserFilesDirPath(file.filename, user.data.id));
			if(!copyFile)
				return reject("Error while moving uploaded file");

			await Files.removeFIle(file.path);
			return resolve(true);
		})
	}

	public static saveInDatabase(file: Express.Multer.File, userId: number, parentId: number|null): Promise<number|boolean> {
		return new Promise(async resolve => {

			const filesRepo = AppDataSource.getRepository(File),
						fileRecord = new File();

			fileRecord.user_id = userId;
			fileRecord.mime = file.mimetype;
			fileRecord.name = file.originalname;
			fileRecord.hash = file.filename;
			fileRecord.parent_id = parentId;

			try {
				await filesRepo.save(fileRecord);
			} catch (error) {
				console.error(error);
				return resolve(false);
			}

			return resolve(fileRecord.id);
		});
	}

}
