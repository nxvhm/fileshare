import { useContext } from "react";
import AuthContext from "../lib/context/AuthContext";
import { Button } from "@mui/material";
function Home() {
	const {user, logoutUser} = useContext(AuthContext);

	return (
		<>
			<div>Welcome {user?.name}</div>
			<p><Button variant="contained" onClick={() => logoutUser()}>Logout</Button></p>
		</>
	)
}

export default Home
