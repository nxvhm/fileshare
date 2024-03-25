import { useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import OpenFileDetailsContext from '../../lib/context/OpenFileDetailsContext';
import {ListItemText, ListItemButton, List, ModalProps} from '@mui/material';

export default function FileDetailsDrawer() {
	const {drawerOpen} = useContext(OpenFileDetailsContext);

	const backdropProps: Partial<ModalProps> = {
		slots: {backdrop: "div",},
		slotProps: {
			root: {
				style: {
					position: "absolute",
					top: "unset", bottom: "unset", left: "unset", right: "unset"
				}
			}
		}
	}

	return (
		<Drawer anchor={'right'} open={drawerOpen} PaperProps={{style: {width: 320}}} ModalProps={backdropProps}>
			<List component="nav">

				<ListItemButton>
					<ListItemText primary="Home" />
				</ListItemButton>

				<ListItemButton>

					<ListItemText primary="Settings" />
				</ListItemButton>

				<ListItemButton>
					<ListItemText primary="Profile" />
				</ListItemButton>

			</List>
		</Drawer>
	)
}
