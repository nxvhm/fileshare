import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {List, ListItem, ListItemIcon, ListItemText, ListItemButton} from '@mui/material';
import {Image as ImageIcon, Folder as FolderIcon} from '@mui/icons-material';


import { FileModel, FileType } from '../../definitions';
import  * as FilesApi from '../../api/Files';
import OpenFileDetailsContext from '../../lib/context/OpenFileDetailsContext';

export type FileListProps = {
	showUploadButton?: boolean,
	showCreateFolderButton?: boolean,
	sharedFilesList?: boolean
}

export default function SharedFilesList(props: FileListProps) {

	const [files, setFiles] = useState<FileModel[]>([]);
	const navigate = useNavigate();
	const {showFileDetails} = useContext(OpenFileDetailsContext);

	useEffect(() => {
			FilesApi.getUserSharedFiles().then(sharedFiles => setFiles(sharedFiles));
	}, [])

	const getDate = (dateString: string): string => {
		if(!dateString)
			return "N/A";

		dateString = dateString.slice(0, 19).replace('T', ' ');
		return new Date(dateString).toDateString();
	}

	const onFileClick = (e: React.MouseEvent, file: FileModel) => {
		const target = (e.target as HTMLBodyElement);
		if(target.classList.contains('fileActionButton') || target.parentElement?.classList.contains('fileActionButton') || target.classList.contains('fileActionIcon'))
			return;

		if(file.type == FileType.TYPE_FOLDER)
			return navigate('/folder/'+file.id);

		showFileDetails(file, null);
	}

	const getFileIcon = (file: FileModel) => {
		return file.type == FileType.TYPE_FILE ? <ImageIcon /> : <FolderIcon />
	}

	const ShowList = () => {
		if(!files.length)
			return;

		return (
			<List>
				{files.map(file => {
					return(
						<ListItemButton key={file.hash} onClick={e => onFileClick(e, file)} style={{paddingTop: 0, paddingBottom: 0, paddingLeft: 0}}>
							<ListItem>
								<ListItemIcon>{getFileIcon(file)}</ListItemIcon>
								<ListItemText primary={file.name} secondary={getDate(String(file.created_at))} />
							</ListItem>
						</ListItemButton>
					)
				})}
			</List>
		)
	}

	return <ShowList />
}
