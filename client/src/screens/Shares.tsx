import FilesList from "../components/files/filesList";

function Shares() {

	return (
		<FilesList
			showCreateFolderButton={false}
			showUploadButton={false}
			sharedFilesList={true}
		/>
	)
}

export default Shares
