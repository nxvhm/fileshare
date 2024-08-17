import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "yet-another-react-lightbox/styles.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Login from './screens/Login.tsx';
import Signup from './screens/Signup.tsx';
import Home from './screens/Home.tsx';
import Folder from './screens/Folder.tsx';
import Shares from './screens/Shares.tsx';
import Profile from './screens/Profile.tsx';
import PublicDownload from './screens/PublicDownload.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import TextFile from './screens/TextFile.tsx';
import { useAuth } from './lib/hooks/useAuth.ts';
import AuthContext from './lib/context/AuthContext.ts';
import {OpenDrawerContextProvider} from './lib/context/OpenDraweContext.tsx';
import { OpenFileDetailsContextProvider } from './lib/context/OpenFileDetailsContext.tsx';
import { ThemeContextProvider } from './lib/context/ThemeContextProvider.tsx';

import './assets/main.css';
const App = function() {

	const {user, loginUser, logoutUser} = useAuth();

	const router = createBrowserRouter([
		{
			path: "/",
			element: <ProtectedRoute><Home /></ProtectedRoute>,
		},
		{
			path: "/folder/:parentId",
			element: <ProtectedRoute><Folder /></ProtectedRoute>
		},
		{
			path: "/text/new/:parentId?",
			element: <ProtectedRoute><TextFile /></ProtectedRoute>
		},
		{
			path: "/text/edit/:id",
			element: <ProtectedRoute><TextFile edit={true} /></ProtectedRoute>
		},
		{
			path: "/shares",
			element: <ProtectedRoute><Shares /></ProtectedRoute>
		},
		{
			path: "/login",
			element: <Login />
		},
		{
			path: "/signup",
			element: <Signup />
		},
		{
			path: "/profile",
			element:  <ProtectedRoute><Profile /></ProtectedRoute>
		},
		{
			path: "/download/:hash",
			element: <PublicDownload></PublicDownload>
		}
	]);

	return(
		<AuthContext.Provider value={{user, loginUser, logoutUser}}>
		<ThemeContextProvider>
		<OpenDrawerContextProvider>
		<OpenFileDetailsContextProvider>
			<RouterProvider router={router} />
		</OpenFileDetailsContextProvider>
		</OpenDrawerContextProvider>
		</ThemeContextProvider>
		</AuthContext.Provider>
	)

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
		<App/>
  </React.StrictMode>,
)
