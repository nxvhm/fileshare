import { useContext, useState } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Button, Box, Container } from "@mui/material";
import Drawer from '../components/main/Drawer';
import Topbar from "../components/main/Topbar";
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
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<div>Welcome {user?.name}</div>
				<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
			</Container>
			</Box>
		</Box>
	)
}

export default Home
