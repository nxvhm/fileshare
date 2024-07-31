import { useState, useEffect } from "react";
import { FileModel } from "../../definitions";
import toast from "react-hot-toast";
import { uploadFile as uploadFileRequest } from "../../api/Files";
import { ListSubheader, List, ListItemText, ListItem, Slide, Chip} from '@mui/material';
import { UploadDialogBox } from "../../components/files/styled";


type fileToUpload = {
	file: File,
	status: 'pending' | 'uploaded'
};

export default function useFileUpload(parentId: undefined|number) {
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)
	const [filesToUpload, setFilesToUpload] = useState<fileToUpload[]|null>(null);

	/**
	 * Upload file to the server
	 * @param files FilesList
	 * @returns void
	 */
	const uploadFile = (files: FileList) => {
		if(!files)
			return;

		const formData = new FormData();
		formData.append("file", files[0]);

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

	/**
	 * When files to upload list is updated
	 */
	useEffect(() => {
		if(!filesToUpload?.length)
			return;

		console.log(filesToUpload);
	}, [filesToUpload])

	const addFilesToUpload = (files: File[]) => {
		const currentFiles = filesToUpload ? [...filesToUpload] : [];
		const incomingFiles = files.map((file: File): fileToUpload => {
				return {
					file: file,
					status: 'pending'
				}
		});

		const merged = [...currentFiles.concat(incomingFiles)];
		setFilesToUpload(merged);
	}

	const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files)
	const getFileToUploadDescription = (file: File): string => file.type + ' '+ file.size/1000 + ' KB';

	const UploaderWidget = (): JSX.Element | undefined => {
		if(!filesToUpload)
			return;

		return(
			<Slide direction="up" in={Boolean(filesToUpload)} mountOnEnter unmountOnExit timeout={250}>
			<UploadDialogBox>
				<List>
					<ListSubheader component="div">
          	Files to upload
        	</ListSubheader>
				{filesToUpload.map((item) => {
				return (
					<ListItem key={item.file.lastModified}>
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
