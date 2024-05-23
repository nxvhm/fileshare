import { useContext } from 'react';
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import OpenDrawerContext from '../../lib/context/OpenDraweContext';
import AuthContext from "../../lib/context/AuthContext";
import {IconButton, Toolbar, Divider, List, ListItemText, ListItemIcon, ListItemButton} from '@mui/material';
import {
	Share as ShareIcon,
	Person as PersonIcon,
	AttachFile as AttachFileIcon,
	ChevronLeft as ChevronLeftIcon,
	PowerSettingsNew as PowerSettingsNewIcon
} from '@mui/icons-material'

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
	const {logoutUser} = useContext(AuthContext);

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

				<ListItemButton component={Link} to={'/profile'}>
					<ListItemIcon>
						<PersonIcon />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</ListItemButton>

				<ListItemButton>
					<ListItemIcon onClick={() => logoutUser()}>
						<PowerSettingsNewIcon />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItemButton>

			</List>
		</DrawerComponent>
	)
}
