import { useState } from "react";
import { FileModel } from "../../definitions";
import axiosInstance from "../Axios";
import toast from "react-hot-toast";

export default function useFileUpload(parentId: undefined|number) {
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)

	const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if(!e.target.files)
			return;

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("file", file);

		if(parentId)
			formData.set('parentId', String(parentId));

		axiosInstance.post('/upload/file',formData, { headers: {
			'Content-Type': 'multipart/form-data'
		}}).then(res => {
			console.log(res);
			if(res.data?.success && res.data?.file)
				setUploadedFile(res.data?.file);

		}).catch(error => {
			toast.error(
				error instanceof Error ? error.message : 'Error Occured, please try again later',
				{duration: 3000, position: 'top-center'}
			);
		})
	}

	return {fileUpload, uploadedFile, setUploadedFile}
}
