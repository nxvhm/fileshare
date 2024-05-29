import { FileModel } from "../../definitions";

export default class FilesHelper {

	public static isViewable(file: FileModel): boolean {
		const imageMimes = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			'application/pdf',
			'application/json'
		];

		return imageMimes.includes(String(file.mime));
	}

	public static isImage(file: FileModel): boolean {
		return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(String(file.mime));
	}

}
