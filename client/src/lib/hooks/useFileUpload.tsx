import { useState, useEffect, useMemo } from "react";
import { FileModel, FileToUpload } from "../../definitions";
import toast from "react-hot-toast";
import { uploadFile as uploadFileRequest } from "../../api/Files";
import { ListSubheader, List, ListItemText, ListItem, Slide, Chip} from '@mui/material';
import { UploadDialogBox } from "../../components/files/styled";
import UploadQueue from "../helpers/UploadQueue";

export default function useFileUpload(parentId: undefined|number) {
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)
	const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]|null>(null);

	const getUploadRequestFormData = (file: File): FormData => {
		const formData = new FormData();
		formData.append("file", file);

		if(parentId)
			formData.set('parentId', String(parentId));

		return formData;
	}

	const uploadFile = (file: File) => {
		const formData = getUploadRequestFormData(file);
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

	const queueUploadHandler = (file: FileToUpload): Promise<FileModel> => {
		const formData = getUploadRequestFormData(file.file);
		return new Promise((resolve, reject) => {
			uploadFileRequest(formData).then(uploadedFile => {
				setUploadedFile(uploadedFile);
				setFilesToUpload(filesToUpload => {
					return !filesToUpload ? [] : filesToUpload.filter(fileToUpload => fileToUpload.hash != file.hash);
				})
				resolve(uploadedFile);
			}).catch(e => {
				toast.error(
					e.response?.data
						? e.response?.data
						: (e instanceof Error ? e.message : 'Error Occured, please try again later'),
					{duration: 3000, position: 'top-center'}
				);
				reject(e);
			})
		})
	}

	useEffect(() => {
		if(!filesToUpload?.length)
			return;
		UploadQueue.addPendingUploads(filesToUpload);
	}, [filesToUpload])

	useEffect(() => {
		UploadQueue.uploadFunction = queueUploadHandler;
	}, [])

	const addFilesToUpload = (files: File[]) => {
		const currentFiles = filesToUpload ? [...filesToUpload] : [];
		const incomingFiles = files.map((file: File): FileToUpload => {
				return {
					file: file,
					status: 'pending',
					hash: (Math.random()).toString(16).substring(3, 10)
				}
		});
		const merged = [...currentFiles.concat(incomingFiles)];
		setFilesToUpload(merged);
	}


	const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])
	const getFileToUploadDescription = (file: File): string => file.type + ' '+ file.size/1000 + ' KB';

	const UploaderWidget = (): JSX.Element | undefined => {
		if(!filesToUpload || !filesToUpload.length)
			return;

		return(
			<Slide direction="up" in={Boolean(filesToUpload)} timeout={250}>
			<UploadDialogBox>
				<List>
					<ListSubheader component="div">
          	Files to upload
        	</ListSubheader>
				{filesToUpload.map((item) => {
				return (
					<ListItem key={(Math.random()).toString(16)}>
						 <ListItemText secondary={getFileToUploadDescription(item.file)}>
								<Chip label={item.status.toUpperCase()} size='small' color='warning' /> {item.file.name}
							</ListItemText>
					</ListItem>
				)
				})}
			</List>
			</UploadDialogBox>
			</Slide>
		)
	}

	return {
		uploadFile,
		uploadedFile,
		setUploadedFile,
		handleSelectedFile,
		filesToUpload,
		addFilesToUpload,
		UploaderWidget
	}
}
