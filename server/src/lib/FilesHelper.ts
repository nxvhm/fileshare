import fs, { PathLike } from "fs";
import { sep } from "path";
import path from 'path';
import { File } from "../models/File.js";
import { AppDataSource } from "../datasource.js";
import { UserTokenPayload, FileTypes } from "../definitions.js";
import { IsNull } from "typeorm";
import { Share } from "@/models/Share.js";

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

	public static saveInDatabase(file: Express.Multer.File, userId: number, parentId: number|null): Promise<File> {
		return new Promise(async (resolve,reject) => {

			const filesRepo = AppDataSource.getRepository(File),
						fileRecord = new File();

			fileRecord.user_id = userId;
			fileRecord.mime = file.mimetype;
			fileRecord.name = file.originalname;
			fileRecord.hash = file.filename;
			fileRecord.filesize = file.size;
			fileRecord.parent_id = parentId;

			try {
				await filesRepo.save(fileRecord);
			} catch (error) {
				console.error(error);
				return reject(error);
			}

			return resolve(fileRecord);
		});
	}

	public static getUserFiles(userId: number, parentId: number|undefined): Promise<File[]> {
		return new Promise( async (resolve, reject) => {
			const filesRepo = AppDataSource.getRepository(File);
			try {
				const userFiles = await filesRepo.find({
					where: {
						user_id: userId,
						parent_id: !parentId ? IsNull() : parentId
					},
					order: {
						id: 'DESC'
					}
				});
				resolve(userFiles);
			} catch (error) {
				reject(error)
			}
		})
	}

	public static getUserSharedFiles(userId: number): Promise<File[]> {
		return new Promise(async(resolve, reject) => {
			const sharedFiles = await AppDataSource.getRepository(File).createQueryBuilder()
				.innerJoin(Share, 'shares', 'shares.file_id = File.id')
				.where('shares.user_id = :userId', {userId: userId})
				.getMany();

			console.log('sharedFiles', sharedFiles);
			resolve(sharedFiles);
		});
	}

	public static createFolder(name: string, userId: number, parentId: number|null): Promise<File|boolean> {
		return new Promise(async (resolve, reject) => {
			const filesRepo = AppDataSource.getRepository(File),
						folder = new File();

			folder.user_id = userId;
			folder.name = name;
			folder.parent_id = parentId;
			folder.type = FileTypes.TYPE_FOLDER;
			folder.hash = await File.generateHash(folder.user_id, name);

			try {
				await filesRepo.save(folder);
			} catch (error) {
				console.error(error);
				return reject(error);
			}

			return resolve(folder);
		})
	}

	public static createTextFile(userId: number, name: string, content: string): Promise<PathLike> {
		return new Promise((resolve, reject) => {
			const filePath = Files.getUserFilesDirPath(undefined, userId) + sep + name;
			fs.writeFile(
				filePath,
				content,
				err => err ? reject(err) : resolve(filePath)
			);
		});
	}

	public static getContents(filePath: PathLike): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, 'utf8', (e, data) => e ? reject(e) : resolve(data));
		})
	}

	public static isViewable(file: File): boolean {
		return File.viewableMimeTypes.includes(file.mime);
	}

	public static isText(file: File): boolean {
		return file.mime ? File.textMimeTypes.includes(file.mime) : false;
	}

	public static getFileStats(path: PathLike): Promise<fs.Stats> {
		return new Promise((resolve, reject) => {
			fs.stat(path, (err, stats) => err ? reject(err) : resolve(stats));
		});
	}

}
