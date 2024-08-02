import { FileModel, FileToUpload } from "../../definitions";

class UploadQueue {

	public static pendingUploads = new Map<string, FileToUpload>;

	/**
	 * The ID of the internval that is looping through the pendingUploads
	 */
	public static uploadIntervalId: number;

	/**
	 * Holds the hash of the currently uploading file.
	 * This hash is a key of the pendingUploads object
	 */
	public static currentlyUploading: string | null;

	/**
	 * The actual upload implementation.
	 * Should be provided from outside the class
	 * and it should return a promise, since we need to know when the upload ends
	 * so we can remove the file from the pending uploads
	 */
	public static uploadFunction: (file: FileToUpload) => Promise<FileModel>;

	public static addPendingUploads(uploads: FileToUpload[]): void {
		uploads.forEach((file: FileToUpload) => {
			if(!this.pendingUploads.has(file.hash))
				this.pendingUploads.set(file.hash, file);
		})

		if(this.pendingUploads.size)
			this.startUploadLoop();
	}

	public static startUploadLoop = () => {
		if(!this.uploadIntervalId)
			this.uploadIntervalId = setInterval(this.processUploads, 1000)
	}

	public static stopUploadLoop = () => {
		if(this.uploadIntervalId)
			clearInterval(this.uploadIntervalId);

		this.currentlyUploading = null;
	}

	public static processUploads = () => {
		const iterator = this.pendingUploads.values();
		const next = iterator.next().value;
		if(!next)
			return this.stopUploadLoop();

		if(this.currentlyUploading == next.hash)
			return;

		this.currentlyUploading = next.hash;
		this.uploadFunction(next).then(_uploadedFile => {
			UploadQueue.pendingUploads.delete(next.hash);
		})
	}

	public static isLooping = (): boolean => {
		return Boolean(this.uploadIntervalId);
	}



}

export default UploadQueue;
