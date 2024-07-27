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

	public static getPublicDownloadUrl(file: FileModel): string {
		return window.location.href + 'download/' + file.hash;
	}

	public static getDate(dateString: string): string {
		if(!dateString)
			return "N/A";

		dateString = dateString.slice(0, 19).replace('T', ' ');
		return new Date(dateString).toDateString();
	}

}
