import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import fileDownload from 'js-file-download';
import {List, ListItem, ListItemIcon, ListItemText, ListItemButton, IconButton} from '@mui/material';
import {Download as DownloadIcon, Image as ImageIcon, Share as ShareIcon, Delete as DeleteIcon, Folder as FolderIcon} from '@mui/icons-material';
import ConfirmationDialog from '../main/ConfirmationDialog';
import { FileModel, FileType } from '../../definitions';
import  * as FilesApi from '../../api/Files';
import toast from 'react-hot-toast';

export type FileListProps = {
	uploadedFile: FileModel|null,
	parentId?: Number|undefined
}

export default function FilesList(props: FileListProps) {

	const [files, setFiles] = useState<FileModel[]>([]);
	const [fileToDelete, setFileToDelete] = useState<FileModel|null>(null)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		FilesApi.getFilesList(props.parentId).then(res => {
			console.log('getLIstResponse', res.data);
			setFiles(res.data);
		})
	}, [])

	useEffect(() => {
		if(props.uploadedFile)
			appendFile(props.uploadedFile);
	}, [props.uploadedFile]);

	const appendFile = (file: FileModel): void => {
		if(!file)
			return;

		if(!file.created_at)
			file.created_at = new Date().toISOString();

		setFiles([file, ...files]);
	}

	const showDeleteConfirmation = (file: FileModel): void => {
		setFileToDelete(file);
		setOpenDeleteConfirmation(true);
	}

	const downloadFile = (file: FileModel): void => {
		if(!file.hash)
			toast.error("File hash not available. Cannot request download");

		FilesApi.downloadFile(String(file.hash)).then(res => {
			fileDownload(res.data, file.name);
		})
	}

	const getDate = (dateString: string): string => {
		if(!dateString)
			return "N/A";

		dateString = dateString.slice(0, 19).replace('T', ' ');
		return new Date(dateString).toDateString();
	}

	const getFileOptionsButton = (file: FileModel): JSX.Element => {
		return (
			<>
			<IconButton onClick={() => downloadFile(file)}><DownloadIcon /></IconButton>
			<IconButton><ShareIcon /></IconButton>
			<IconButton onClick={() => showDeleteConfirmation(file)}><DeleteIcon /></IconButton>
			</>
		)
	}

	const onFileClick = (file: FileModel) => {
		if(file.type == FileType.TYPE_FOLDER)
			return navigate('/folder/'+file.id);
	}

	const deleteFile = () => {
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

	const getFileIcon = (file: FileModel) => {
		return (
			<>
				{file.type == FileType.TYPE_FILE ? <ImageIcon /> : <FolderIcon />}
			</>
		)
	}

	const ShowList = () => {
		if(!files.length)
			return;

		return (
			<List>
				{files.map(file => {
					return(
						<ListItemButton key={file.hash} onClick={() => onFileClick(file)} style={{paddingTop: 0, paddingBottom: 0}}>
							<ListItem secondaryAction={getFileOptionsButton(file)}>
								<ListItemIcon>{getFileIcon(file)}</ListItemIcon>
								<ListItemText primary={file.name} secondary={getDate(String(file.created_at))} />
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
