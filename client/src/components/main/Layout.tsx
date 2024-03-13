import { useContext } from "react";
import { Button, Box, Container, Toolbar } from "@mui/material";
import { Toaster } from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Topbar from "./Topbar";
import Drawer from "./Drawer";
import CreateFolder from "../files/createFolder";
import useFileUpload from "../../lib/hooks/useFileUpload";
import AuthContext from "../../lib/context/AuthContext";

export default function Layout({children}: {children: React.ReactNode}) {
	const {user, logoutUser} = useContext(AuthContext);
	const {fileUpload} = useFileUpload();

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


	return(
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
			{children}

			<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
		</Container>
		</Box>
		<Toaster />
	</Box>
	)

}
