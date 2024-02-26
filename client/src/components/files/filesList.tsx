import {useState, useEffect} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { IconButton } from '@mui/material';
import {Download as DownloadIcon, Image as ImageIcon, Share as ShareIcon, Delete as DeleteIcon} from '@mui/icons-material';
import ConfirmationDialog from '../main/ConfirmationDialog';
import { FileModel } from '../../definitions';
import  * as FilesApi from '../../api/Files';
import toast, { ToastOptions, Toaster } from 'react-hot-toast';


export type FileListProps = {
	uploadedFile: FileModel|null
}

export default function FilesList(props: FileListProps) {

	const [files, setFiles] = useState<FileModel[]>([]);
	const [fileToDelete, setFileToDelete] = useState<FileModel|null>(null)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

	useEffect(() => {
		FilesApi.getFilesList().then(res => {
			console.log('getLIstResponse', res.data);
			setFiles(res.data);
		})
	}, [])

	useEffect(() => {
		if(props.uploadedFile)
			appendFile(props.uploadedFile);
	}, [props.uploadedFile]);

	function appendFile(file: FileModel) {

		console.log('appendFile', file);
		if(!file)
			return;

		setFiles([file, ...files]);
	}

	function showDeleteConfirmation(file: FileModel) {
		setFileToDelete(file);
		setOpenDeleteConfirmation(true);
	}

	function getDate(dateString: string): string {
		dateString = dateString.slice(0, 19).replace('T', ' ');
		return new Date(dateString).toDateString();
	}

	function getFileOptionsButton(file: FileModel) {
		return (
			<>
			<IconButton><DownloadIcon /></IconButton>
			<IconButton><ShareIcon /></IconButton>
			<IconButton onClick={() => showDeleteConfirmation(file)}><DeleteIcon /></IconButton>
			</>
		)
	}

	function deleteFile() {
		if(!fileToDelete || !fileToDelete?.id)
			return setOpenDeleteConfirmation(false);

		FilesApi.deleteFile(fileToDelete?.id).then(res => {
			if(res.data.success) {
				toast.success("File deleted");
				setFiles(files.filter(file => file.id != fileToDelete.id ));
			} else {
				toast.error("Error deleting file");
			}
			setOpenDeleteConfirmation(false);
		}).catch(e => {
			toast.error("Error deleting file");
			console.error('alert deleting file');
		})
	}

	function ShowList() {
		if(!files.length)
			return;

		return (
			<List>
				{files.map(file => {
					return(
						<ListItemButton key={file.hash}>
							<ListItem secondaryAction={getFileOptionsButton(file)}>
								<ListItemIcon><ImageIcon /></ListItemIcon>
								<ListItemText primary={file.name} secondary="dsadsa" />
							</ListItem>
						</ListItemButton>
					)
				})}
			</List>
		)
	}

	return(
		<>
			<ShowList />
			<ConfirmationDialog
				isOpen={openDeleteConfirmation}
				onConfirm={deleteFile}
				onCancel={() => {setOpenDeleteConfirmation(false)}}
				dialogText='Are you sure you want to delete this file ?'
				secondaryDialogText='Action cannot be reverted'
			></ConfirmationDialog>
		</>
	);
}
