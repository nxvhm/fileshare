import { FileModel, ShareRecord, UserSearchResult } from "../definitions";
import axiosInstance from "../lib/Axios"
import { Token } from "../lib/Token";

export const uploadFile = (form: FormData): Promise<FileModel> => {
	return new Promise((resolve, reject) => {
		axiosInstance.post('/files/upload', form, {
			headers: {'Content-Type': 'multipart/form-data'}
		}).then(res => {
			if(res.data?.success && res.data?.file)
				return resolve(res.data?.file);
		}).catch(err => reject(err));
	});
}

export const deleteFile = (id: number) => {
	return axiosInstance.post('/files/delete', {id});
}

export const deleteMultiple = (ids: number[]) => {
	return axiosInstance.post('/files/delete/multiple', {files: ids});
}

export const getFilesList = (parentId: Number|undefined) => {
	return axiosInstance.get('/files/list'+(parentId ? `/${parentId}` : ''));
}

export const downloadFile = (hash: string) => {
	return axiosInstance.get('/files/download/'+hash, {
		responseType: 'blob'
	});
}

export const createFolder = (name: string, parentId: number|undefined) => {
	return axiosInstance.post('/files/create-folder', {name, parentId});
}

export const createText = (name: string, parentId: number|undefined, text: string) => {
	return axiosInstance.post('/files/text', {name, text, parentId});
}

export const getBreadcrumbs = (folderId: number|undefined) => {
	const params: Record<string, string|number> = {};

	if(folderId)
		params.folderId = folderId;

	return axiosInstance.get('/files/breadcrumbs', {params});
}

export const searchUsers = (term: string):Promise<UserSearchResult[]> => {
	return new Promise((resolve, reject) => {
		axiosInstance.get('/users/search', {params: {term}})
			.then(result => resolve(result.data))
			.catch(error => reject(error))
	});
}

export const shareFile = (userId: number, fileId: number): Promise<ShareRecord> => {
	return new Promise((resolve, reject) => {
		axiosInstance.post('/files/share', {userId, fileId})
			.then(res => resolve(res.data))
			.catch(e => reject(e))
	});
}

export const getFileShares = (fileId: number): Promise<ShareRecord[]> => {
	return new Promise((resolve, reject) => {
		axiosInstance.get('/files/shares', {params: {fileId}})
			.then(res => resolve(res.data))
			.catch(e => reject(e));
	});
}

export const removeShare = (fileId: number, userId: number): Promise<Boolean> => {
	return new Promise((resolve, reject) => {
		axiosInstance.delete(`/files/share/${fileId}/${userId}`)
			.then(() => resolve(true))
			.catch(e => reject(e));
	})
}

export const getUserSharedFiles = (): Promise<FileModel[]> => {
	return new Promise((resolve, reject) => {
		axiosInstance.get('/files/shared')
			.then((res) => resolve(res.data))
			.catch(e => reject(e));
	})
}

export const toggleFilePublic = (fileId: number, isPublic: 0|1): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		axiosInstance.post('/files/set-public', {fileId, public: isPublic})
			.then(_res => resolve(true))
			.catch(e => reject(e));
	})
}

export const getViewableFileUrl = (file: FileModel): string => {
	const parts = [import.meta.env.VITE_API_URL, 'files', 'view', file.hash];

	if(!file.public)
		parts.push(Token.get());

	return parts.join('/');
}

export const getFileInfo = (hash: string): Promise<FileModel> => {
	return new Promise((resolve, reject) => {
		axiosInstance.get(`/files/info/${hash}`)
		.then(res => resolve(res.data))
		.catch(e=> reject(e))
	})
}
