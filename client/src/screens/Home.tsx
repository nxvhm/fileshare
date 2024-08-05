import FilesList from "../components/files/filesList";

function Home() {

	return (
		<FilesList
			enableSelecFiles={true}
			enableDeleteFiles={true}
		/>
	)
}

export default Home
