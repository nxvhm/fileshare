import {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import fileDownload from 'js-file-download';
import toast from 'react-hot-toast';

import {List, ListItem, ListItemIcon, ListItemText, ListItemButton, IconButton, Box, Button} from '@mui/material';
import {Download as DownloadIcon, Image as ImageIcon, Share as ShareIcon, Delete as DeleteIcon, Folder as FolderIcon, CloudUpload as CloudUploadIcon} from '@mui/icons-material';

import { styled } from '@mui/material/styles';

import ConfirmationDialog from '../main/ConfirmationDialog';
import { FileModel, FileType } from '../../definitions';
import  * as FilesApi from '../../api/Files';
import CreateFolder from './createFolder';
import useFileUpload from '../../lib/hooks/useFileUpload';
import Breadcrumbs from './breadcrumbs';
import OpenFileDetailsContext from '../../lib/context/OpenFileDetailsContext';

export type FileListProps = {
	parentId?: number|undefined
}

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export default function FilesList() {

	const [files, setFiles] = useState<FileModel[]>([]);
	const [fileToDelete, setFileToDelete] = useState<FileModel|null>(null)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
	const { parentId } = useParams();
	const navigate = useNavigate();
	const {fileUpload, uploadedFile, setUploadedFile} = useFileUpload(Number(parentId));
	const {showFileDetails} = useContext(OpenFileDetailsContext);


	useEffect(() => {
		FilesApi.getFilesList(Number(parentId)).then(res => setFiles(res.data))
	}, [parentId])

	useEffect(() => {
		if(!uploadedFile)
			return;

		appendFile(uploadedFile);
	}, [uploadedFile]);

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

	const onFolderCreate = (folder: FileModel): void => {
		setUploadedFile(folder);
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
			{file.type != FileType.TYPE_FOLDER && <IconButton onClick={() => downloadFile(file)}><DownloadIcon /></IconButton>}
			<IconButton><ShareIcon /></IconButton>
			<IconButton onClick={() => showDeleteConfirmation(file)} className='fileActionButton' id='DeleteIcon'>
				<DeleteIcon />
			</IconButton>
			</>
		)
	}

	const onFileClick = (e: React.MouseEvent, file: FileModel) => {
		const target = (e.target as HTMLBodyElement);
		if(target.classList.contains('fileActionButton') || target.parentElement?.classList.contains('fileActionButton'))
			return;

		if(file.type == FileType.TYPE_FOLDER)
			return navigate('/folder/'+file.id);

		showFileDetails(file);
	}

	const deleteFile = () => {
		if(!fileToDelete || !fileToDelete?.id)
			return setOpenDeleteConfirmation(false);

		FilesApi.deleteFile(fileToDelete?.id).then(res => {
			if(!res.data.success)
				return toast.error("Error deleting file");

			toast.success("File deleted");
			setFiles(files.filter(file => file.id != fileToDelete.id ));
			setOpenDeleteConfirmation(false);

		}).catch(e => {
			toast.error("Error deleting file");
			console.error("Error deleting file", e);
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
						<ListItemButton key={file.hash} onClick={e => onFileClick(e, file)} style={{paddingTop: 0, paddingBottom: 0, paddingLeft: 0}}>
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
			<Box sx={{display: 'flex', gap: 1, paddingLeft: 1}}>
				<Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
					Upload file
					<VisuallyHiddenInput type="file" onChange={fileUpload} />
				</Button>
				<CreateFolder onFolderCreate={onFolderCreate} />
			</Box>
			<Box sx={{display: 'flex', marginTop: 2, paddingLeft: 1}}>
				<Breadcrumbs folderId={Number(parentId)} />
			</Box>
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
