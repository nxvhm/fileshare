import { useEffect, useState } from "react";
import { getFileShares, removeShare, shareFile } from "../../api/Files";
import { FileModel, ShareRecord, UserSearchResult } from "../../definitions";
import {Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Autocomplete, TextField, IconButton, Typography} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

import toast from 'react-hot-toast';

export type useFileShareProps = {
	file: FileModel
}

export function useFileShare(props: useFileShareProps) {

	const {file} = props;
	const [currentShares, setCurrentShares] = useState<ShareRecord[]>([]);

	useEffect(() => getShares(), [file])

	const getShares = (): void => {
		file && getFileShares(file.id).then(shares => setCurrentShares(shares));
	}

	const removeShareForFile = (fileId: number, userId: number): void => {
		removeShare(fileId, userId).then(() => setCurrentShares(
			currentShares.filter(share => share.user_id != userId)
		)).catch(e => {
			toast.error(
				e.response?.data ? e.response?.data : (e instanceof Error ? e.message : 'Error Occured, please try again later'),
				{duration: 3000, position: 'top-center'}
			)
		})
	}

	const shareWithUser = (user: UserSearchResult): void => {
		if (!user?.id || !file?.id)
			return;

		shareFile(user.id, file.id).then(shareRecord => {
			toast.success(`File shared with ${user.name}`);
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


	return {file, currentShares, removeShareForFile, shareWithUser, GetCurrentSharesList}
}
