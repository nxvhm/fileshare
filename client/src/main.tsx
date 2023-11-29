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


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
