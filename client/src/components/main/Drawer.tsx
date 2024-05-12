import { useContext } from 'react';
import {IconButton, Toolbar, Divider, List} from '@mui/material';
import { Link } from "react-router-dom";
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ShareIcon from '@mui/icons-material/Share';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import OpenDrawerContext from '../../lib/context/OpenDraweContext';
import {ListItemText, ListItemIcon, ListItemButton} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth: number = 240;

const DrawerComponent = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		'& .MuiDrawer-paper': {
			position: 'relative',
			whiteSpace: 'nowrap',
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			boxSizing: 'border-box',
			...(!open && {
				overflowX: 'hidden',
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen,
				}),
				width: theme.spacing(7),
				[theme.breakpoints.up('sm')]: {
					width: theme.spacing(9),
				},
			}),
		},
	}),
);

export default function Drawer() {
	const {drawerOpen, toggleDrawer} = useContext(OpenDrawerContext);

	return (
		<DrawerComponent variant="permanent" open={drawerOpen}>
			<Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1]}}>
				<IconButton onClick={toggleDrawer}>
					<ChevronLeftIcon />
				</IconButton>
			</Toolbar>
			<Divider />
			<List component="nav">

				<ListItemButton component={Link} to={'/'} >
					<ListItemIcon>
						<AttachFileIcon />
					</ListItemIcon>
					<ListItemText primary="My Files" />
				</ListItemButton>

				<ListItemButton component={Link} to={'/shares'}>
					<ListItemIcon>
						<ShareIcon />
					</ListItemIcon>
					<ListItemText primary="Shared with me" />
				</ListItemButton>

				<ListItemButton>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Settings" />
				</ListItemButton>

				<ListItemButton>
					<ListItemIcon>
						<PersonIcon />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</ListItemButton>


			</List>
		</DrawerComponent>
	)
}
