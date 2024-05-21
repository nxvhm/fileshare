import { useContext, useEffect, useState } from 'react';
import {ModalProps, Typography, Box, Toolbar, Switch, FormControlLabel, Drawer} from '@mui/material';
import { grey } from '@mui/material/colors';
import { FileModel } from '../../definitions';
import { useFileShare } from "../../lib/hooks/useFileShares";
import OpenFileDetailsContext from '../../lib/context/OpenFileDetailsContext';
import { toggleFilePublic as toggleFilePublicRequest } from '../../api/Files';

export default function FileDetailsDrawer() {
	const {drawerOpen, toggleDrawer, selectedFile, onFileChange} = useContext(OpenFileDetailsContext);
	const { currentShares, GetCurrentSharesList } = useFileShare({file: selectedFile as FileModel});
	const [isPublic, setIsPublic] = useState<boolean>(false);

	const backdropProps: Partial<ModalProps> = {
		slotProps: {
			backdrop: {sx: {background: "none"}},
			root: {
				style: {
					position: "absolute",
					top: "unset", bottom: "unset", left: "unset", right: "unset"
				}
			}
		}
	}

	const getFileSize = (file: FileModel): string => {
		return !file.filesize || file.filesize == 0 ? 'N/A' : (file.filesize/1000 + ' KB');
	}

  const togglePublic = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(!selectedFile || !onFileChange)
			return;

		const isPublic = event.target.checked ? 1 : 0;
		toggleFilePublicRequest(selectedFile.id, isPublic)
			.then(_res => {
				setIsPublic(Boolean(isPublic));
				onFileChange(selectedFile.id, {public: isPublic});
			})
			.catch(e => console.error(e));
  };

	useEffect(() => {
		setIsPublic(Boolean(selectedFile?.public));
	}, [selectedFile]);


	return (
		<Drawer onClose={toggleDrawer} anchor={'right'} open={drawerOpen} PaperProps={{style: {width: 320}}} ModalProps={backdropProps}>
			<Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1]}}>
				&nbsp;
			</Toolbar>
				<Box padding={3} paddingTop={3}>

					<Typography fontSize={15}>File Type</Typography>
					<Typography fontSize={12} color={grey[500]}>{selectedFile?.mime}</Typography>

					<Typography fontSize={15} marginTop={2}>Size</Typography>
					<Typography fontSize={12} color={grey[500]}>{selectedFile?.filesize && getFileSize(selectedFile)}</Typography>

					<Typography fontSize={15} marginTop={2}>Public</Typography>
					<FormControlLabel label={isPublic ? "Yes" : "No"} control={
            <Switch checked={isPublic} onChange={togglePublic} name="isPublic" />
					}/>


					<Typography fontSize={15} marginTop={2}>Uploaded</Typography>
					<Typography fontSize={12} color={grey[500]}>{selectedFile?.created_at}</Typography>

				</Box>
				<Box paddingLeft={3}>
					<Typography fontSize={15}>{currentShares.length ? "Shared with" : "No shares"}</Typography>
				</Box>
				<Box paddingLeft={1}>
					<GetCurrentSharesList />
				</Box>
		</Drawer>
	)
}
