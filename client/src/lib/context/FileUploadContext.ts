import { createContext } from "react";
import { FileModel } from "../../definitions";

export type FileUploadContextData = {
	uploadedFile: FileModel|null,
	setUploadedFile: (file: FileModel|null) => void,
	fileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FileUploadContext = createContext<FileUploadContextData>({} as FileUploadContextData);

export default FileUploadContext;
