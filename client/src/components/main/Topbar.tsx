import { useContext } from "react";
import { styled } from '@mui/material/styles';
import { Toolbar, IconButton, Typography, Badge } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import OpenDrawerContext from "../../lib/context/OpenDraweContext";
import NotificationsIcon from '@mui/icons-material/Notifications';

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const drawerWidth: number = 240;
const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

export default function Topbar() {
	const {drawerOpen, toggleDrawer} = useContext(OpenDrawerContext);

	return(
		<AppBar position="absolute" open={drawerOpen}>
			<Toolbar>
				<IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}
					sx={{...(drawerOpen && { display: 'none' })}}
				>
					<MenuIcon />
				</IconButton>
				<Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
					FileShare
				</Typography>
				<IconButton color="inherit">
					<Badge badgeContent={4} color="secondary">
						<NotificationsIcon />
					</Badge>
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}
