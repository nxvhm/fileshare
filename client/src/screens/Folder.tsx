import { useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import FilesList from "../components/files/filesList";
import useFileUpload from "../lib/hooks/useFileUpload";

function Folder() {
	const { parentId } = useParams();

	return (
		<FilesList parentId={Number(parentId)}/>
	)
}

export default Folder;
