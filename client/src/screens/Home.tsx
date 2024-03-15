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
	const {fileUpload, uploadedFile, setUploadedFile} = useFileUpload();

	return (
		<FilesList uploadedFile={uploadedFile}/>
	)
}

export default Home
