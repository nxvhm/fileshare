import fs, { PathLike } from "fs";
import { sep } from "path";
import path from 'path';

export class Files {

	public static __dirName = path.resolve()
	public static filesDir = process.env.FILES_DIR ? process.env.FILES_DIR : "files";

	public static getUserFilesDirPath(file?: string|PathLike): string|PathLike {
		return Files.__dirName + sep + Files.filesDir + (file ? (sep+file) : '');
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

	public static moveUploadedFile(file: Express.Multer.File): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			const exists = await Files.exists(file.destination);
			if(!exists)
				return reject("File not uploaded or not readable")

			const filesDirExists = await Files.exists(Files.getUserFilesDirPath());
			if(!filesDirExists) {
				const filesDirCreated = await Files.mkdir(Files.getUserFilesDirPath());
				if(!filesDirCreated)
					return reject("Files directory not available at the moment");
			}

			const copyFile = await Files.copyFile(file.path, Files.getUserFilesDirPath(file.filename));
			if(!copyFile)
				return reject("Error while moving uploaded file");

			return resolve(true);
		})
	}


}
