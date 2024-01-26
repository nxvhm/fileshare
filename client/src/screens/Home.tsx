import { useContext, useState } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Button, Box, Container } from "@mui/material";
import Drawer from '../components/main/Drawer';
import Topbar from "../components/main/Topbar";
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axiosInstance from "../lib/Axios";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function Home() {
	const {user, logoutUser} = useContext(AuthContext);

	const fileUpload = e => {
		if(!e.target.files)
			return;

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("file", file);
		axiosInstance.post('/upload',formData, { headers: {
			'Content-Type': 'multipart/form-data'
		}}).then(res => {
			console.log(res);
		})
	}

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

				<Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
					Upload file
					<VisuallyHiddenInput type="file" onChange={fileUpload} />
				</Button>

				<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
			</Container>
			</Box>
		</Box>
	)
}

export default Home
