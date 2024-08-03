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
	user?: UserTokenData
}

export type AuthTokenPayload = {
	data: UserTokenData
	iat: number,
	exp: number
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
	setSelectedFile: (file: FileModel|null) => void,
	showFileDetails: (file: FileModel, filePropUpdateHandler: filePropUpdateHandler) => void,
	onFileChange: filePropUpdateHandler,
	setOnFileChange: (onChange: filePropUpdateHandler) => void
}

export type filePropUpdateHandler = ((id: number, updatedProp: Partial<FileModel>) => void) | null

export type ShareRecord = {
	user_id: number,
	file_id: number,
	created_at: string,
	user: {
		name: string
	}
}

export type UserSearchResult = {
	id: number,
	name: string,
	email: string
}

export type UserProfileData = {
	name: string,
	email: string,
	password: string,
	newPassword: string | null,
	rePassword: string | null
}

export type FileToUpload = {
	file: File,
	hash: string
};
