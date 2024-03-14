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

export const createFolder = (name: string) => {
	return axiosInstance.post('/upload/create-folder', {name});
}
