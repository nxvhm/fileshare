import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Login from './screens/Login.tsx';
import Signup from './screens/Signup.tsx';
import Home from './screens/Home.tsx';
import Folder from './screens/Folder.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';

import { useAuth } from './lib/hooks/useAuth.ts';
import AuthContext from './lib/context/AuthContext.ts';

import {OpenDrawerContextProvider} from './lib/context/OpenDraweContext.tsx';
import { OpenFileDetailsContextProvider } from './lib/context/OpenFileDetailsContext.tsx';

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
			path: "/login",
			element: <Login />
		},
		{
			path: "/signup",
			element: <Signup />
		},
	]);

	return(
		<AuthContext.Provider value={{user, loginUser, logoutUser}}>
		<OpenDrawerContextProvider>
		<OpenFileDetailsContextProvider>
			<RouterProvider router={router} />
		</OpenFileDetailsContextProvider>
		</OpenDrawerContextProvider>
		</AuthContext.Provider>
	)

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
		<App/>
  </React.StrictMode>,
)
