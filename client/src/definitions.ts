export enum FileType {
	TYPE_FILE = 'file',
	TYPE_FOLDER = 'folder'
}

export type FileModel = {
	id: number,
	user_id: number|null,
	name: string,
	parent_id: number|null,
	hash: string|null,
	mime: string|null,
	filesize: number,
	type: FileType,
	public: 1|0
	created_at: string|null,
}

export type UserTokenData = {
	id: number,
	name: string,
	email: string
 }


export type OpenDrawerContextType = {
	drawerOpen: boolean,
	toggleDrawer?: () => void
}

export type FileDetailsDrawerContextType = {
	drawerOpen: boolean,
	toggleDrawer: () => void,
	selectedFile: FileModel|null,
	setSelectedFile?: (file: FileModel|null) => void,
	showFileDetails: (file: FileModel) => void
}

export type ShareRecord = {
	id: number,
	user_id: number,
	file_id: number
}

export type UserSearchResult = {
	id: number,
	name: string,
	email: string
}
