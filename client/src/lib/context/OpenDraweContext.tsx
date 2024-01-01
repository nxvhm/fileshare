import { createContext, PropsWithChildren, useState } from "react";

export type OpenDrawerContextType = {
	drawerOpen: boolean,
	toggleDrawer?: () => void
}

const defaultState = {
	drawerOpen: false
}

const OpenDrawerContext = createContext<OpenDrawerContextType>(defaultState);

export const OpenDrawerContextProvider = ({children}: PropsWithChildren<{}>) => {

	const [drawerOpen, setDrawerOpen] = useState(false);
	const toggleDrawer = () => setDrawerOpen(!drawerOpen)

	return(
		<OpenDrawerContext.Provider value={{drawerOpen, toggleDrawer}}>
			{children}
		</OpenDrawerContext.Provider>
	)
}

export default OpenDrawerContext
