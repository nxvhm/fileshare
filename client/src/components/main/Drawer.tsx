import { useContext } from 'react';
import {IconButton, Toolbar} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/material/styles';
import OpenDrawerContext from '../../lib/context/OpenDraweContext';

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
		</DrawerComponent>
	)
}
