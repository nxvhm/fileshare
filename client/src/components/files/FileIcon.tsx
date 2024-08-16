import { FileModel, FileType } from "../../definitions";
import FilesHelper from "../../lib/helpers/FileHelper";
import {
	Image as ImageIcon,
	Folder as FolderIcon,
	AttachFile as AttachFileIcon,
	TextFormat as TextFormIcon,
} from '@mui/icons-material';

const FileIcon = (props: {file: FileModel}): JSX.Element => {
	const {file} = props;
	if (FilesHelper.isImage(file)) {
		return <ImageIcon sx={{verticalAlign: 'middle'}} />;
	} else if (FileType.TYPE_FOLDER == file.type) {
		return  <FolderIcon sx={{verticalAlign: 'middle'}}/>
	} else {
		switch(file.mime) {
			case 'text/plain': return <TextFormIcon sx={{verticalAlign: 'middle'}} />
			case 'text/html': return <TextFormIcon sx={{verticalAlign: 'middle'}} />
			case 'application/octet-stream':  return <AttachFileIcon sx={{verticalAlign: 'middle'}}></AttachFileIcon>
			default: return <AttachFileIcon sx={{verticalAlign: 'middle'}}></AttachFileIcon>
		}
	}
}

export default FileIcon
