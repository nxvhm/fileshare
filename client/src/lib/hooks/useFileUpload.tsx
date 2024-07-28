import { useState, useEffect } from "react";
import { FileModel } from "../../definitions";
import toast from "react-hot-toast";
import { uploadFile as uploadFileRequest } from "../../api/Files";
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { ListSubheader, List,ListItemButton, ListItemText, ListItem} from '@mui/material';

export default function useFileUpload(parentId: undefined|number) {
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)
	const [filesToUpload, setFilesToUpload] = useState<File[]|null>(null);
	const theme = useTheme();

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

	const handleSelectedFile =  (e: React.ChangeEvent<HTMLInputElement>) => {
		if(!e.target.files)
			return;

		uploadFile(e.target.files);
	}

	const getFileToUploadDescription = (file: File): string => file.type + ' '+ file.size/1000 + ' KB';
	const UploaderWidget = (): JSX.Element | undefined => {
		if(!filesToUpload)
			return;

		return(
			<Box sx={{
				backgroundColor: theme.palette.background.default,
				borderRadius: 2,
				color: theme.palette.text.primary,
				width: {sm: '100%', md: '300px', 'lg': '500px'},
				position: 'absolute',
				right: 15,
				bottom: 15,
				zIndex: 1300,
				boxShadow: '0px 5px 25px #d6d6d6'
			}}>
				<List>
					<ListSubheader component="div">
          	Files to upload
        	</ListSubheader>
				</List>
				{filesToUpload.map((file) => {
				return (
					<ListItem key={file.lastModified}>
						 <ListItemText secondary={getFileToUploadDescription(file)}>{file.name}</ListItemText>
					</ListItem>
				)
				})}
			</Box>
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
