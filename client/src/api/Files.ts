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
