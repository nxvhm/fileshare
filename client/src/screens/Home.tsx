import { Link } from "react-router-dom";

function Home() {
	return (
		<>
			<div>Home page</div>
			<p><Link to={'/login'}>Login</Link></p>
			<p><Link to={'/signup'}>Signup</Link></p>
		</>
	)
}

export default Home
