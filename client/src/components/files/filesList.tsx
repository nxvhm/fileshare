import {useState, useEffect} from 'react';
import axiosInstance from '../../lib/Axios';
import { FileModel } from '../../definitions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ImageIcon from '@mui/icons-material/Image';
import ListItemButton from '@mui/material/ListItemButton';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../main/ConfirmationDIalog';

export default function FilesList(props) {

	const [files, setFiles] = useState([]);
	const [toDelete, setToDelete] = useState<FileModel|null>(null)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

	useEffect(() => {
		axiosInstance.get('/files/list').then(res => {
			console.log('getLIstResponse', res.data);
			setFiles(res.data);
		})
	}, [])

	useEffect(() => {
		appendFile(props.uploadedFile);
	}, [props.uploadedFile]);

	function appendFile(file) {

		console.log('appendFile', file);
		if(!file)
			return;

		setFiles([file, ...files]);
	}

	function confirmDeletion(file: FileModel) {
		setToDelete(file);
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
			<IconButton onClick={() => confirmDeletion(file)}><DeleteIcon /></IconButton>
			</>
		)
	}

	function deleteFile() {
		console.log('deletion confirmed', toDelete);
		setOpenDeleteConfirmation(false);
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
