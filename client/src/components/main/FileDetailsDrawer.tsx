import { useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import OpenFileDetailsContext from '../../lib/context/OpenFileDetailsContext';
import {ModalProps, Typography, Box, Toolbar} from '@mui/material';
import { grey } from '@mui/material/colors';
import { FileModel } from '../../definitions';
import { useFileShare } from "../../lib/hooks/useFileShares";

export default function FileDetailsDrawer() {
	const {drawerOpen, toggleDrawer, selectedFile} = useContext(OpenFileDetailsContext);
	const { currentShares, GetCurrentSharesList } = useFileShare({file: selectedFile as FileModel});

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
		if(!file.filesize || file.filesize == 0)
			return 'N/A';

		return file.filesize/1000 + ' KB';
	}

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
					<Typography fontSize={12} color={grey[500]}>{selectedFile?.public ? 'Yes' : 'No'}</Typography>

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
