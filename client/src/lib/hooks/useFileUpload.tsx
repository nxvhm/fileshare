import { useState, useEffect } from "react";
import { FileModel } from "../../definitions";
import toast from "react-hot-toast";
import { uploadFile as uploadFileRequest } from "../../api/Files";
import { useTheme } from '@mui/material/styles';
import { ListSubheader, List, ListItemText, ListItem, Slide} from '@mui/material';
import { UploadDialogBox } from "../../components/files/styled";
export default function useFileUpload(parentId: undefined|number) {
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)
	const [filesToUpload, setFilesToUpload] = useState<File[]|null>(null);

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
				{filesToUpload.map((file) => {
				return (
					<ListItem key={file.lastModified}>
						 <ListItemText secondary={getFileToUploadDescription(file)}>{file.name}</ListItemText>
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
		setFilesToUpload,
		UploaderWidget
	}
}
