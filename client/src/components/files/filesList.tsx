import {useState, useEffect} from 'react';
import axiosInstance from '../../lib/Axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import ListItemButton from '@mui/material/ListItemButton';

export default function FilesList() {

	const [files, setFiles] = useState([]);
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

	useEffect(() => {
		axiosInstance.get('/files/list').then(res => {
			console.log('getLIstResponse', res.data);
			setFiles(res.data);
		})
	}, [])

	function getDate(dateString: string): string {
		dateString = dateString.slice(0, 19).replace('T', ' ');
		return new Date(dateString).toDateString();

	}

	function ShowList() {
		if(!files.length)
			return;

		return (
			<List>
				{files.map(file => {
					return(
						<ListItemButton key={file.hash}>
							<ListItem>
								<ListItemIcon><ImageIcon /></ListItemIcon>
								<ListItemText primary={file.name} secondary={getDate(file.created_at)} />
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
