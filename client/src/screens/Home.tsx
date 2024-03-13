import { useContext, useState } from "react";
import { Button, Box, Container, Toolbar } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import toast, { Toaster } from 'react-hot-toast';
import { styled } from '@mui/material/styles';

import AuthContext from "../lib/context/AuthContext";
import axiosInstance from "../lib/Axios";
import useFileUpload from "../lib/hooks/useFileUpload";
import Drawer from '../components/main/Drawer';
import Topbar from "../components/main/Topbar";
import CreateFolder from "../components/files/createFolder";
import FilesList from "../components/files/filesList";
import { FileModel } from "../definitions";

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
	const {fileUpload, uploadedFile, setUploadedFile} = useFileUpload();

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
				<Box sx={{display: 'flex', gap: 1}}>
					<Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
						Upload file
						<VisuallyHiddenInput type="file" onChange={fileUpload} />
					</Button>

					<CreateFolder />
				</Box>
				<FilesList uploadedFile={uploadedFile}/>

				<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
			</Container>
			</Box>
			<Toaster />
		</Box>
	)
}

export default Home
