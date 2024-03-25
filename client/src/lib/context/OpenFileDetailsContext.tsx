import { useState, createContext, PropsWithChildren } from "react";
import { FileDetailsDrawerContextType, FileModel } from "../../definitions";


const defaultState = {
	drawerOpen: false,
	selectedFile: null,
	toggleDrawer: () => {}
}

const OpenFileDetailsContext = createContext<FileDetailsDrawerContextType>(defaultState);

export const OpenFileDetailsContextProvider = ({children}: PropsWithChildren<{}>) => {

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<FileModel|null>(null);

	const toggleDrawer = () => setDrawerOpen(!drawerOpen);

	return(
		<OpenFileDetailsContext.Provider value={{drawerOpen, toggleDrawer, selectedFile, setSelectedFile}}>
			{children}
		</OpenFileDetailsContext.Provider>
	)
}

export default OpenFileDetailsContext;
