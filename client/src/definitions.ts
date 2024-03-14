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
	created_at: string|null,
	type: FileType
}

export type UserTokenData = {
	id: number,
	name: string,
	email: string
 }
