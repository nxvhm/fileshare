import { useContext } from 'react';
import {IconButton, Toolbar, Divider, List} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import OpenDrawerContext from '../../lib/context/OpenDraweContext';
import {ListItemText, ListItemIcon, ListItemButton} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
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
		<List component="nav">

			<ListItemButton>
				<ListItemIcon>
					<HomeIcon />
				</ListItemIcon>
				<ListItemText primary="Home" />
			</ListItemButton>

			<ListItemButton>
				<ListItemIcon>
					<SettingsIcon />
				</ListItemIcon>
				<ListItemText primary="Settings" />
			</ListItemButton>
		</List>

		</DrawerComponent>
	)
}
