import {useState, useEffect} from 'react';
import axiosInstance from '../../lib/Axios';
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

export default function FilesList(props) {

	const [files, setFiles] = useState([]);
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

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

	function getDate(dateString: string): string {
		dateString = dateString.slice(0, 19).replace('T', ' ');
		return new Date(dateString).toDateString();

	}

	function getFileOptionsButton(file) {
		return (
			<>
			<IconButton><DownloadIcon /></IconButton>
			<IconButton><ShareIcon /></IconButton>
			<IconButton><DeleteIcon /></IconButton>
			</>
		)
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
		<ShowList />
	);
}
