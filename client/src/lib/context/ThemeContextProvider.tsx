import { createTheme, ThemeProvider } from "@mui/material";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

const ALL_MODES = ['dark', 'light'] as const;
export type ThemesList = typeof ALL_MODES[number]
export type ThemeContextType = {
  switchMode: (theme: ThemesList) => void,
	mode: ThemesList,
};

const ThemeContext = createContext<ThemeContextType>({
  switchMode: (_mode: ThemesList) => {},
	mode: 'light'
});

export const ThemeContextProvider = ({children}: PropsWithChildren<{}>) => {
	const defaultMode: ThemesList = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'

	const [mode, setMode] = useState<ThemesList>(defaultMode);
	const switchMode = (theme: ThemesList) => {
		setMode(theme);
		setCurrentlySelectedMode(theme);
	}

	const theme = createTheme({
		palette: { mode }
	})

	useEffect(() => {
		const current = getCurrenlySelectedMode();
		current && setMode(current);
	}, [])

	const setCurrentlySelectedMode = (mode: ThemesList) => localStorage.setItem('mode', mode);

	const getCurrenlySelectedMode = (): ThemesList | null => {
		const currentlySelectedMode = localStorage.getItem('mode') as ThemesList;
		return currentlySelectedMode && ALL_MODES.includes(currentlySelectedMode) ? currentlySelectedMode : null;
	}


	return(
		<ThemeContext.Provider value={{mode, switchMode }}>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	)
}

export default ThemeContext
