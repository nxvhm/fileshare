import { useState, createContext, PropsWithChildren } from "react";
import { FileDetailsDrawerContextType, FileModel, filePropUpdateHandler } from "../../definitions";

const defaultState = {
	drawerOpen: false,
	selectedFile: null,
	toggleDrawer: () => {},
}

const OpenFileDetailsContext = createContext<FileDetailsDrawerContextType>(defaultState as FileDetailsDrawerContextType);

export const OpenFileDetailsContextProvider = ({children}: PropsWithChildren<{}>) => {

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<FileModel|null>(null);
	const toggleDrawer = () => setDrawerOpen(!drawerOpen);
	const [onFileChange, setOnFileChange] = useState<filePropUpdateHandler>(null);
	const showFileDetails = (file: FileModel, onFilePropChange: filePropUpdateHandler) => {
		setOnFileChange(() => onFilePropChange);
		setSelectedFile(file);
		setDrawerOpen(true);
	}

	return(
		<OpenFileDetailsContext.Provider value={{drawerOpen, toggleDrawer, selectedFile, setSelectedFile, showFileDetails, onFileChange, setOnFileChange}}>
			{children}
		</OpenFileDetailsContext.Provider>
	)
}

export default OpenFileDetailsContext;
