import { useContext, useState } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Button, Box, Container } from "@mui/material";
import Drawer from '../components/main/Drawer';
import Topbar from "../components/main/Topbar";
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';

const HiddenFileInput = styled('input')({
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	width: 1,
})


function Home() {
	const {user, logoutUser} = useContext(AuthContext);

	return (
		<Box sx={{ display: 'flex' }}>
			<Topbar />
			<Drawer />

			<Box component="main" sx={{
        backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
				flexGrow: 1, height: '100vh', overflow: 'auto'}}
			>
			<Toolbar />
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<div>Welcome {user?.name}</div>
				<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
			</Container>
			</Box>
		</Box>
	)
}

export default Home
