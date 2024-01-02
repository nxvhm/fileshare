import { useContext, useState } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Button, Box, Toolbar, IconButton, Typography, Badge, Container } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import OpenDrawerContext from "../lib/context/OpenDraweContext";
import Drawer from '../components/main/Drawer';

function Home() {
	const {user, logoutUser} = useContext(AuthContext);
	const {drawerOpen, toggleDrawer} = useContext(OpenDrawerContext);

	console.log("is drawer open:", drawerOpen);

	const drawerWidth: number = 240;

	interface AppBarProps extends MuiAppBarProps {
		open?: boolean;
	}

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

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar position="absolute" open={drawerOpen}>
				<Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                ...(drawerOpen && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              FileShare
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
        </Toolbar>
			</AppBar>
			<Drawer />

			<Box component="main" sx={{
        backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
				flexGrow: 1, height: '100vh', overflow: 'auto'}}
			>
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<div>Welcome {user?.name}</div>
				<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>

			</Container>
			</Box>
		</Box>
	)
}

export default Home
