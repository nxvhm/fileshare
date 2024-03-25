import { useContext } from "react";
import { Button, Box, Container, Toolbar} from "@mui/material";
import { Toaster } from 'react-hot-toast';

import Topbar from "./Topbar";
import Drawer from "./Drawer";
import FileDetailsDrawer from "./FileDetailsDrawer";
import AuthContext from "../../lib/context/AuthContext";

export default function Layout({children}: {children: React.ReactNode}) {
	const {logoutUser} = useContext(AuthContext);

	return(
		<Box sx={{ display: 'flex' }}>
		<Topbar />
		<Drawer />
		<FileDetailsDrawer></FileDetailsDrawer>
		<Box component="main" sx={{
			backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
			flexGrow: 1, height: '100vh', overflow: 'auto'}}
		>
		<Toolbar />
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			{children}
			<p>
				<Button variant="contained" onClick={() => logoutUser()}>Logout</Button>
			</p>
		</Container>
		</Box>
		<Toaster />
	</Box>
	)

}
