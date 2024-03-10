import { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { createFolder as createFolderRequest} from '../../api/Files';

export default function CreateFolder() {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [inputError, setInputError] = useState<boolean|string>(false);
	const [folderName, setFolderName] = useState<string>('');

	const onChangeFolderName = (e) => {
		const folderName = e.target.value;
		if(!folderName)
			return setInputError('Please enter folder name');

		if(!String(folderName).match(/^[a-zA-Z0-9_-]+$/))
			return setInputError('Only Alphanumeric charasters, underscore & dash are allowed');

		setInputError(false);
		setFolderName(String(folderName));
	}

	const createFolder = () => {
		if(inputError)
			return false;

		createFolderRequest(folderName).then(res => {
			console.log('createFolderResult', res);
		})
	}

	return (
		<>
		<Button component="label" variant="contained" onClick={e => setOpenDialog(true)} startIcon={<CreateNewFolderIcon />}>
			Add Folder
		</Button>
		<Dialog open={openDialog} maxWidth={'xs'} fullWidth={true}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title" textAlign={'center'}>Create New Folder</DialogTitle>
				<DialogContent>
						<FormControl variant="standard"></FormControl>
						<Input
							onChange={onChangeFolderName}
							id="folder-name-input"
							aria-describedby="folderName-error"
							placeholder="Folder Name"
							fullWidth
						/>
						{inputError && <FormHelperText error={true} id="folderName-error">{inputError}</FormHelperText>}
				</DialogContent>
			<DialogActions>
				<Button onClick={e => setOpenDialog(false)}>Cancel</Button>
				<Button onClick={e => createFolder()}>Create</Button>
			</DialogActions>
		</Dialog>
		</>
	)
}
