import { useState, useEffect } from "react";
import { FileModel, FileToUpload } from "../../definitions";
import toast from "react-hot-toast";
import { uploadFile as uploadFileRequest } from "../../api/Files";
import { ListSubheader, List, ListItemText, ListItem, Slide, Chip} from '@mui/material';
import { UploadDialogBox } from "../../components/files/styled";
import UploadQueue from "../helpers/UploadQueue";

export default function useFileUpload() {
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)
	const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]|null>(null);
	const [filesStatus, setFilesStatus] = useState<{[key: string]: string}>({});
	const [parentFolderId, setParentFolderId] = useState<undefined|number>();

	useEffect(() => {
		if(!filesToUpload?.length)
			return;
		UploadQueue.addPendingUploads(filesToUpload);
	}, [filesToUpload])

	useEffect(() => {
		UploadQueue.uploadFunction = queueUploadHandler;
	}, [])

	useEffect(() => {
		UploadQueue.uploadFunction = queueUploadHandler;
	}, [parentFolderId])

	const getUploadRequestFormData = (file: File): FormData => {
		const formData = new FormData();
		formData.append("file", file);

		if(parentFolderId)
			formData.set('parentId', String(parentFolderId));

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

	/**
	 * @description Try to upload file, set it's status to uploading.
	 * Function passed to UploadQueue class and executed from there
	 */
	const queueUploadHandler = (file: FileToUpload): Promise<FileModel> => {
		setFilesStatus(filesStatus => {
			const currentStatus = {...filesStatus};
			currentStatus[file.hash] = 'uploading';
			return {...currentStatus};
		});

		return new Promise((resolve, reject) => {
			const formData = getUploadRequestFormData(file.file);
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

	/**
	 * Add files to the upload list,
	 * register them as status pending
	 */
	const addFilesToUpload = (files: File[]) => {
		const currentFiles = filesToUpload ? [...filesToUpload] : [];
		const currentStatuses = {...filesStatus};
		const incomingFiles = files.map((file: File): FileToUpload => {
			const fileToUpload = {
				file: file,
				hash: (Math.random()).toString(16).substring(3, 10)
			} as FileToUpload;

			if(!currentStatuses.hasOwnProperty(fileToUpload.hash))
					currentStatuses[fileToUpload.hash] = 'pending';

			return fileToUpload;
		});
		setFilesStatus({...currentStatuses});
		setFilesToUpload([...currentFiles.concat(incomingFiles)]);
	}


	const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])
	const getFileToUploadDescription = (file: File): string => file.type + ' '+ file.size/1000 + ' KB';
	const getUploadingStatus = (file: FileToUpload): JSX.Element | undefined => {
		const status = filesStatus.hasOwnProperty(file.hash) ? filesStatus[file.hash] : 'N/A';
		return (
			<Chip label={status.toUpperCase()} size='small' color={status == 'pending' ? 'warning' : 'info'} />
		)
	}

	const UploaderWidget = (): JSX.Element | undefined => {
		if(!filesToUpload || !filesToUpload.length)
			return;

		return(
			<Slide direction="up" in={Boolean(filesToUpload)} timeout={250} appear={false}>
			<UploadDialogBox>
				<List>
					<ListSubheader component="div">
          	Files to upload
        	</ListSubheader>
				{filesToUpload.map((item) => {
				return (
					<ListItem key={item.hash}>
						 <ListItemText secondary={getFileToUploadDescription(item.file)}>
								{getUploadingStatus(item)}&nbsp;{item.file.name}
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
		setParentFolderId,
		handleSelectedFile,
		filesToUpload,
		addFilesToUpload,
		UploaderWidget
	}
}
