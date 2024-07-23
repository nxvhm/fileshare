import { createTheme, ThemeProvider } from "@mui/material";
import { createContext, PropsWithChildren, useState } from "react";

export type ThemesList = 'dark' | 'light';
export type ThemeContextType = {
  switchMode: (theme: ThemesList) => void,
	mode: ThemesList,
};

const ThemeContext = createContext<ThemeContextType>({
  switchMode: (mode: ThemesList) => {},
	mode: 'light'
});

export const ThemeContextProvider = ({children}: PropsWithChildren<{}>) => {
	const defaultMode: ThemesList = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'

	const [mode, setMode] = useState<ThemesList>(defaultMode);
	const switchMode = (theme: ThemesList) => {
		setMode(theme);
	}

	const theme = createTheme({
		palette: { mode }
	})

	return(
		<ThemeContext.Provider value={{mode, switchMode }}>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	)
}

export default ThemeContext
