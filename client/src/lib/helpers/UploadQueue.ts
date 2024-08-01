import { FileToUpload } from "../../definitions";

class UploadQueue {

	public static pendingUploads: {[key: string]: FileToUpload} = {};
	public static uploadProcessHandler: number;

	public static addPendingUploads(uploads: FileToUpload[]): void {
		uploads.forEach((file: FileToUpload) => {
			if(!this.pendingUploads.hasOwnProperty(file.hash))
				this.pendingUploads[file.hash] = file;
		})

		if(Object.keys(this.pendingUploads).length)
				this.startUpload();
	}

	public static startUpload = () => {
		if(!this.uploadProcessHandler)
			this.uploadProcessHandler = setInterval(this.processUploads, 1000)
	}

	public static processUploads = () => {
		console.log('uploading....', this.pendingUploads);
	}

}

export default UploadQueue;
