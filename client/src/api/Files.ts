import { AxiosRequestConfig } from "axios";
import axiosInstance from "../lib/Axios"

export const deleteFile = (id: number) => {
	return axiosInstance.post('/files/delete', {id});
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
	return axiosInstance.post('/upload/create-folder', {name, parentId});
}

export const getBreadcrumbs = (folderId: number|undefined) => {
	const params: Record<string, string|number> = {};

	if(folderId)
		params.folderId = folderId;

	return axiosInstance.get('/files/breadcrumbs', {params});
}

export type UserSearchResult = {
	id: number,
	name: string,
	email: string
}

export const searchUsers = (term: string):Promise<UserSearchResult[]> => {
	return new Promise((resolve, reject) => {
		axiosInstance.get('/users/search', {params: {term}}).then(result => {
				return resolve(result.data);
		}).catch(error => {
			reject(error);
		})
	})
}
