import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { FileModel } from '../../definitions';

export type CreateFolderProps = {
	onFolderCreate: (folder: FileModel) => void;
}

export default function CreateFolder(props: CreateFolderProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [inputError, setInputError] = useState<boolean|string>(false);
	const [folderName, setFolderName] = useState<string>('');
	const {parentId} = useParams();

	const onChangeFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
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

		createFolderRequest(folderName, parentId ? Number(parentId) : undefined).then(res => {
			if(res.status !== 200)
				return;

			props.onFolderCreate((res.data as FileModel));
			setOpenDialog(false);
		});
	}

	return (
		<>
		<Button component="label" variant="contained" onClick={() => setOpenDialog(true)} startIcon={<CreateNewFolderIcon />}>
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
				<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
				<Button onClick={() => createFolder()}>Create</Button>
			</DialogActions>
		</Dialog>
		</>
	)
}
