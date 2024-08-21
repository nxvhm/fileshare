import {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import fileDownload from 'js-file-download';
import toast from 'react-hot-toast';
import Lightbox from "yet-another-react-lightbox";
import ConfirmationDialog from '../main/ConfirmationDialog';
import { FileModel, FileType, filePropUpdateHandler, LightboxSlide } from '../../definitions';
import  * as FilesApi from '../../api/Files';
import CreateFolder from './createFolder';
import useFileUpload from '../../lib/hooks/useFileUpload';
import FilesHelper from '../../lib/helpers/FileHelper';
import Breadcrumbs from './breadcrumbs';
import ShareDialog from './shareDialog';
import DragAndDropOverlay from './DragAndDropOverlay';
import OpenFileDetailsContext from '../../lib/context/OpenFileDetailsContext';
import { useTheme } from '@mui/material/styles';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileIcon from './FileIcon';
import ViewTextFileDialog from './viewTextFileDialog';

import {
	IconButton,
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Checkbox
} from '@mui/material';

import {
	Download as DownloadIcon,
	Share as ShareIcon,
	Delete as DeleteIcon,
	CloudUpload as CloudUploadIcon,
	RemoveRedEye as RemoveRedEyeIcon,
	FileCopy as FileCopyIcon,
	TextFormat as TextFormIcon,
	Edit as EditIcon
} from '@mui/icons-material';

import { VisuallyHiddenInput, FileTableRow } from './styled';

export type FileListProps = {
	showUploadButton?: boolean,
	showCreateFolderButton?: boolean,
	enableDeleteFiles?: boolean
	enableSelecFiles?: boolean
}

export default function FilesList(props: FileListProps) {

	let {showUploadButton, showCreateFolderButton} = props;
	showUploadButton = showUploadButton ?? true;
	showCreateFolderButton = showCreateFolderButton ?? true;

	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [slides, setSlides] = useState<LightboxSlide[]>([]);
	const [slideIndex, setSlideIndex] = useState<number>(0);
	const [files, setFiles] = useState<FileModel[]>([]);
	const [fileToDelete, setFileToDelete] = useState<FileModel|null>(null)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState<boolean>(false);
  const [openDeleteMultipleConfirmation, setOpenDeleteMultipleConfirmation] = useState<boolean>(false);
  const [openShareWindow, setOpenShareWindow] = useState<boolean>(false);
  const [openViewText, setOpenViewText] = useState<boolean>(false);
  const [viewTextId, setViewTextId] = useState<number>();

  const [fileShare, setFileShare] = useState<FileModel|null>(null);
	const [dragOver, setDragOver] = useState<boolean>(false);
	const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
	const {showFileDetails} = useContext(OpenFileDetailsContext);
	const { parentId } = useParams();
	const navigate = useNavigate();
	const uploader = useFileUpload(Number(parentId));
	const theme = useTheme();

	useEffect(() => {
			FilesApi.getFilesList(Number(parentId)).then(res => setFiles(res.data))
	}, [parentId])

	useEffect(() => {
		if(!uploader.uploadedFile)
			return;

		appendFile(uploader.uploadedFile);
	}, [uploader.uploadedFile]);

	useEffect(() => {
		setSlides(files.filter(file => FilesHelper.isImage(file)).map(file => {
			return {src: FilesApi.getViewableFileUrl(file)};
		}));
	}, [files])

	const FileActionsButtons = (props: {file: FileModel}): JSX.Element => {
		const {file} = props;
		return (
			<>
			{FilesHelper.isImage(file) && <IconButton onClick={() => openLightbox(file)} className='fileActionButton'><RemoveRedEyeIcon className='fileActionIcon'/></IconButton>}
			{file.type != FileType.TYPE_FOLDER && <IconButton onClick={() => downloadFile(file)} className='fileActionButton'><DownloadIcon className='fileActionIcon'/></IconButton>}
			<IconButton className='fileActionButton' id='ShareButton' onClick={() => shareFile(file)}><ShareIcon className='fileActionIcon' /></IconButton>
			<IconButton onClick={() => showDeleteConfirmation(file)} className='fileActionButton' id='DeleteButton'>
				<DeleteIcon className='fileActionIcon' />
			</IconButton>
			</>
		)
	}

	const DeleteSelectedFileButton = (props: FileListProps): JSX.Element | undefined => {
		if(!props.enableDeleteFiles || !selectedFiles.length)
			return;

		return (
			<Button component="label" variant="contained" color='error'
				onClick={() => setOpenDeleteMultipleConfirmation(true)}
				startIcon={<DeleteIcon />}>
				Delete Selected ({selectedFiles.length})
			</Button>
		)
	}

	const CopyPublicUrl = ({file}: {file: FileModel}): JSX.Element | undefined => {
		if (!file.public)
			return;

		return(
			<CopyToClipboard text={FilesHelper.getPublicDownloadUrl(file)} onCopy={() => {toast.success("Download URL Copied to clipboard")}}>
					<FileCopyIcon sx={{fontSize: 'medium', pl: 1, verticalAlign: 'middle'}} onClick={_e => false}/>
			</CopyToClipboard>
		)
	}

	const ShowTableViewList = (props: FileListProps): JSX.Element => {
		if(!files.length){
			return(
				<Typography textAlign={'center'} color={theme.palette.text.primary}>No Uploaded files. Drag and Drop files to upload or use the button</Typography>
			);
		}

		return (
			<Table size='small' sx={{marginTop: 2}}>
				<TableHead>
					<TableRow sx={{paddingLeft: 0}}>
						<TableCell sx={{ paddingLeft: 0}}>
							{props.enableSelecFiles && <Checkbox aria-label='Selected All' onClick={selectAllFiles} checked={files.length == selectedFiles.length} />}
							Name
						</TableCell>
						<TableCell>Uploaded</TableCell>
						<TableCell>Size</TableCell>
						<TableCell>Public</TableCell>
						<TableCell>Shares</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{files.map((file: FileModel) => (
						<FileTableRow key={file.id}>
							<TableCell sx={{paddingLeft: 0}} onClick={e => onFileClick(e, file)}>
								{props.enableSelecFiles && <Checkbox checked={Boolean(selectedFiles.includes(file.id))} onClick={e => toggleFileSelected(e, file.id)}/>}
								<FileIcon file={file} />
								{FilesHelper.isText(file) ? <Button variant="text" onClick={e => openTextViewModal(e, file)}>{file.name}</Button> : file.name}
								{FilesHelper.isText(file) && <IconButton component={Link} to={`/text/edit/${file.id}`} onClick={e => e.stopPropagation()}><EditIcon /></IconButton>}
							</TableCell>
							<TableCell onClick={e => onFileClick(e, file)}>{FilesHelper.getDate(String(file.created_at))}</TableCell>
							<TableCell onClick={e => onFileClick(e, file)}>{!file.filesize || file.filesize == 0 ? 'N/A' : (file.filesize/1000 + ' KB')}</TableCell>
							<TableCell>
								{file.public ? 'Yes' : 'No'}
								<CopyPublicUrl file={file}/>
							</TableCell>
							<TableCell onClick={e => onFileClick(e, file)}>N/A</TableCell>
							<TableCell><FileActionsButtons file={file} /></TableCell>
						</FileTableRow>
					))}
				</TableBody>
			</Table>
		)
	}

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

		FilesHelper.isViewable(file)
			? window.open(FilesApi.getViewableFileUrl(file), '_blank')?.focus()
			: FilesApi.downloadFile(String(file.hash)).then(res => fileDownload(res.data, file.name));
	}

	const onFolderCreate = (folder: FileModel): void => {
		uploader.setUploadedFile(folder)
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

	const deleteMultipleFiles = () => {
		FilesApi.deleteMultiple(selectedFiles).then(_res => {
			setFiles(files =>  [...files.filter(file => !selectedFiles.includes(file.id))]);
			setSelectedFiles([]);
			setOpenDeleteMultipleConfirmation(false);
		}).catch(e => toast.error(e.response?.data ? e.response.data : 'Error occurred while deleting files'))
	}

	const onPublicStatusChange: filePropUpdateHandler = (fileId: number, updatedProp: Partial<FileModel>) => {
		const fileKey = files.findIndex(file => file.id == fileId);
		files[fileKey] = {...files[fileKey], ...updatedProp}
		setFiles([...files]);
	}

	const shareFile = (file: FileModel) => {
		setFileShare(file);
		setOpenShareWindow(true);
	}

	const closeFileShare = () => {
		setFileShare(null);
		setOpenShareWindow(false)
	}

	const openLightbox = (file: FileModel) => {
		const imageUrl = FilesApi.getViewableFileUrl(file);
		const selectedImageIndex = slides.findIndex(slide => slide.src == imageUrl);
		setSlideIndex(selectedImageIndex);
		setLightboxOpen(true);
	}

	const selectAllFiles = () => {
		setSelectedFiles(current => current.length == files.length ? [] : files.map(file => file.id));
	}

	const openTextEdit = () => {
		Number(parentId)
		navigate(parentId ? `/text/new/${parentId}` : '/text/new');
	}

	const openTextViewModal = (e: React.MouseEvent, file: FileModel) => {
		e.stopPropagation();
		setViewTextId(file.id);
		setOpenViewText(true);
	}

	const onFileClick = (_e: React.MouseEvent, file: FileModel) => {
		// if(FilesHelper.isText(file))
		// 	return navigate('/text/edit/'+file.id);

		file.type == FileType.TYPE_FOLDER ? navigate('/folder/'+file.id) : showFileDetails(file, onPublicStatusChange);
	}

	const toggleFileSelected = (e: React.MouseEvent,  id: number) => {
		e.stopPropagation();

		setSelectedFiles(current => {
			current.includes(id) ? current.splice(current.indexOf(id), 1) : current.push(id);
			return [...current];
		})
	}

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer?.files) {
			const filesToUploadArray = Array.from(e.dataTransfer.files).filter(item => item.size && item.type);
			filesToUploadArray.length && uploader.addFilesToUpload(filesToUploadArray);
		}

		if (dragOver)
			setDragOver(false);
	}

	const onDragEnd = (e: React.DragEvent) => {
		e.preventDefault();
		console.log('onDragEnd', e);
	}

	const onDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		if (!dragOver)
			setDragOver(true);
	}

	const onDragOut = () => {
		setDragOver(false)
	}

	return(
		<>
		<Box className='fileListContainer' component='div' sx={{position: 'relative', minHeight: '250px'}}
			onDrop={onDrop}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragLeave={onDragOut}>

			<DragAndDropOverlay open={dragOver} handleDragOut={onDragOut}></DragAndDropOverlay>
			<Box sx={{display: 'flex', gap: 1}}>
				{showUploadButton &&
					<Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
						Upload file
						<VisuallyHiddenInput type="file" onChange={uploader.handleSelectedFile} />
					</Button>
				}
				{showCreateFolderButton && <CreateFolder onFolderCreate={onFolderCreate} />}
				<DeleteSelectedFileButton {...props} />
				<Button variant="contained" onClick={() => openTextEdit()}startIcon={<TextFormIcon />}>
					New Text File
				</Button>
			</Box>
			<Box sx={{display: 'flex', marginTop: 2}}>
				<Breadcrumbs folderId={Number(parentId)} />
			</Box>

			<ShowTableViewList {...props} />
			<ShareDialog open={openShareWindow} file={fileShare} onClose={closeFileShare} />
			<ConfirmationDialog
				isOpen={openDeleteConfirmation}
				onConfirm={deleteFile}
				onCancel={() => {setOpenDeleteConfirmation(false)}}
				dialogText='Are you sure you want to delete this file ?'
				secondaryDialogText='Action cannot be reverted'
			/>
			<ConfirmationDialog
				isOpen={openDeleteMultipleConfirmation}
				onConfirm={deleteMultipleFiles}
				onCancel={() => {setOpenDeleteMultipleConfirmation(false)}}
				dialogText='Are you sure you want to delete these files ?'
				secondaryDialogText='Action cannot be reverted'
			/>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
				index={slideIndex}
      />
		</Box>
		{<uploader.UploaderWidget></uploader.UploaderWidget>}
		<ViewTextFileDialog open={openViewText} fileId={Number(viewTextId)} handleClose={() => setOpenViewText(false)} editable={true} />
		</>
	);
}
