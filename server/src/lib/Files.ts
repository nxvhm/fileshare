import fs, { PathLike } from "fs";
import { sep } from "path";
import path from 'path';


export class Files {

	public static __dirName = path.resolve()
	public static filesDir = process.env.FILES_DIR ? process.env.FILES_DIR : "files";

	public static exists(filePath: string|fs.PathLike): Promise<boolean> {
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

	public static mkdir(dir: string|fs.PathLike): Promise<boolean> {
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

	public static getUserFilesDirPath(): string|PathLike {
		return Files.__dirName + sep + Files.filesDir;
	}

}
