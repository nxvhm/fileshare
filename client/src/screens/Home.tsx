import { useContext, useState } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Button, Box, Container } from "@mui/material";
import Drawer from '../components/main/Drawer';
import Topbar from "../components/main/Topbar";
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axiosInstance from "../lib/Axios";
import FilesList from "../components/files/filesList";
import toast, { ToastOptions, Toaster } from 'react-hot-toast';
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
	const [uploadedFile, setUploadedFile] = useState<FileModel|null>(null)

	const fileUpload = e => {
		if(!e.target.files)
			return;

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("file", file);
		axiosInstance.post('/upload/file',formData, { headers: {
			'Content-Type': 'multipart/form-data'
		}}).then(res => {
			console.log(res);
			if(res.data?.success && res.data?.file)
				setUploadedFile(res.data?.file);

		}).catch(error => {
			toast.error(
				error instanceof Error ? error.message : 'Error Occured, please try again later',
				{duration: 3000, position: 'top-center'}
			);
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

				<FilesList uploadedFile={uploadedFile}/>

				<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
			</Container>
			</Box>
			<Toaster />
		</Box>
	)
}

export default Home
