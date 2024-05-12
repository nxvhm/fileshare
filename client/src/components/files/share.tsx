import { useState, SyntheticEvent } from "react";
import { FileModel, UserSearchResult } from "../../definitions";
import {Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField} from '@mui/material';
import { searchUsers } from "../../api/Files";
import { Toaster } from 'react-hot-toast';
import { useFileShare } from "../../lib/hooks/useFileShares";
export type ShareProps = {
	open: boolean
	file?: FileModel|null,
	onClose: () => void
}

export default function Share(props: ShareProps) {
  const {open, file, onClose} = props;
	const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserSearchResult|null>(null);
	const {shareWithUser, GetCurrentSharesList} = useFileShare({file: file as FileModel});

	const onSearch = (e: SyntheticEvent, value: string) => {
		if (value.length >= 3)
			searchUsers(value).then(result => result.length ? setUserResults(result) : null)
	}

	const shareWithSelectedUser = () => {
		if (selectedUser?.id && file?.id)
			shareWithUser(selectedUser);
	}

	return(
		<Dialog open={open} maxWidth={'sm'} fullWidth={true} onClose={() => onClose()} scroll="body">
			<DialogTitle id="alert-dialog-title" textAlign={'center'}>Share {file?.name}</DialogTitle>
			<DialogContent sx={{paddingTop: 3}}>
				<Box>
					<Autocomplete id="combo-box-demo"
						getOptionLabel={el => el.name}
						options={userResults} sx={{ width: 'auto' }}
						renderInput={(params) => <TextField {...params} label="Share with..." />}
						onInputChange={onSearch}
						onChange={(_event, value) => setSelectedUser(value as UserSearchResult)}
					/>
				</Box>
				<Box><GetCurrentSharesList /></Box>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" color="primary" onClick={shareWithSelectedUser}>Share with user</Button>
				<Button variant="outlined" color="error" onClick={() => props.onClose()}>Cancel</Button>
			</DialogActions>
			<Toaster />
		</Dialog>
	)

}
