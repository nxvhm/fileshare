import { useState } from "react";
import { FileModel } from "../../definitions";
import toast from "react-hot-toast";
import { uploadFile as uploadFileRequest } from "../../api/Files";

export default function useFileUpload(parentId: undefined|number) {
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)

	const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if(!e.target.files)
			return;

		const formData = new FormData();
		formData.append("file", e.target.files[0]);

		if(parentId)
			formData.set('parentId', String(parentId));

		uploadFileRequest(formData)
			.then(file => setUploadedFile(file))
			.catch(e => {
				toast.error(
					e.response?.data
						? e.response?.data
						: (e instanceof Error ? e.message : 'Error Occured, please try again later'),
					{duration: 3000, position: 'top-center'}
				);
			})
	}

	return {fileUpload, uploadedFile, setUploadedFile}
}
