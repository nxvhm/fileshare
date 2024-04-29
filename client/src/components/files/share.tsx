import { useEffect, useState, SyntheticEvent } from "react";
import { FileModel, ShareRecord, UserSearchResult } from "../../definitions";
import {Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Autocomplete, TextField, IconButton, Typography} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { searchUsers, shareFile, getFileShares, removeShare } from "../../api/Files";
import toast, { Toaster } from 'react-hot-toast';

export type ShareProps = {
	open: boolean
	file?: FileModel|null,
	onClose: () => void
}

export default function Share(props: ShareProps) {
  const {open, file, onClose} = props;
	const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserSearchResult|null>(null);
	const [currentShares, setCurrentShares] = useState<ShareRecord[]>([]);

	const onSearch = (e: SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => {
		if (value.length < 3)
			return;

		searchUsers(value).then(result => {
			if (!result.length)
					return;

			setUserResults(result);
		});
	}

	useEffect(() => {
		if(!file?.id)
			return;

		getFileShares(file?.id).then(shares => setCurrentShares(shares));
	}, [file])

	const shareWithSelectedUser = () => {
		if (!selectedUser?.id || !file?.id)
			return;

		shareFile(selectedUser.id, file.id).then(shareRecord => {
			toast.success(`File shared with ${selectedUser.name}`);
			setCurrentShares([...currentShares, shareRecord]);
		}).catch(e => toast.error(
			e.response?.data ? e.response?.data : (e instanceof Error ? e.message : 'Error Occured, please try again later'),
			{duration: 3000, position: 'top-center'}
		))
	}

	const GetCurrentSharesList = () => {
		if(!currentShares.length)
			return;

		return(
			<List>
			{currentShares.map(share => {
				return (
					<ListItem
						key={['share-id', share.file_id, share.user_id].join('-')}
						secondaryAction={
							<IconButton edge='end' onClick={() => removeShareForFile(share.file_id, share.user_id)}>
								<BlockIcon />
							</IconButton>
						}
					>
						<ListItemText>
							{share.user.name}
							<Typography variant='caption' gutterBottom display='block'>
								shared on {share.created_at}
							</Typography>
						</ListItemText>
					</ListItem>
				)
			})}
			</List>
		);
	}

	const removeShareForFile = (fileId: number, userId: number) => {
		removeShare(fileId, userId).then(() => setCurrentShares(
			currentShares.filter(share => share.user_id != userId)
		)).catch(e => {
			toast.error(
				e.response?.data ? e.response?.data : (e instanceof Error ? e.message : 'Error Occured, please try again later'),
				{duration: 3000, position: 'top-center'}
			)
		})
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
						onChange={(event, value) => setSelectedUser(value as UserSearchResult)}
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
