import { useState } from "react";
import { FileModel } from "../../definitions";
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteInputChangeReason } from '@mui/material/Autocomplete';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import { SyntheticEvent } from "react";
import { searchUsers, UserSearchResult } from "../../api/Files";

export type ShareProps = {
	open: boolean
	file?: FileModel|null,
	onClose: () => void
}

export default function Share(props: ShareProps) {
  const { open, file, onClose } = props;
	const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserSearchResult|null>(null);

	const onSearch = (e: SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => {
		if(value.length < 3)
			return;

		searchUsers(value).then(result => {
			if(!result.length)
					return;

			setUserResults(result);
			console.log('search users res:', result);
		});
	}

	const shareWithSelectedUser = () => {
		console.log('share with', selectedUser);
	}

	return(
		<Dialog open={open} maxWidth={'sm'} fullWidth={true} onClose={() => onClose()} scroll="body">
			<DialogTitle id="alert-dialog-title" textAlign={'center'}>Share {file?.name}</DialogTitle>
			<DialogContent sx={{paddingTop: 3}}>
					<Autocomplete id="combo-box-demo"
						getOptionLabel={el => el.name}
						options={userResults} sx={{ width: 'auto' }}
						renderInput={(params) => <TextField {...params} label="Share with..." />}
						onInputChange={onSearch}
						onChange={(event, value) => setSelectedUser(value as UserSearchResult)}
					/>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" color="primary" onClick={shareWithSelectedUser}>Share with user</Button>
				<Button variant="outlined" color="error">Cancel</Button>
			</DialogActions>
		</Dialog>
	)

}
