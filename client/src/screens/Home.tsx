import { useContext, useState } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Button, Box, Toolbar, IconButton, Typography, Badge } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { styled } from '@mui/material/styles';
function Home() {
	const {user, logoutUser} = useContext(AuthContext);
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

	const drawerWidth: number = 240;

	interface AppBarProps extends MuiAppBarProps {
		open?: boolean;
	}


	const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
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
			<AppBar position="absolute" open={open}>
				<Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
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
			<Drawer variant="permanent" open={open}>
				<Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1]}}>
					<IconButton onClick={toggleDrawer}>
						<ChevronLeftIcon />
					</IconButton>
        </Toolbar>
			</Drawer>

			<Box component="main" sx={{
        backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
				flexGrow: 1, height: '100vh', overflow: 'auto'}}
			>

			<div>Welcome {user?.name}</div>
			<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
				</Box>
		</Box>
	)
}

export default Home
