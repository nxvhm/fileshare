import axiosInstance from "../lib/Axios"

export const deleteFile = (fileId: number) => {
	return axiosInstance.post('/files/delete', {id: fileId});
}

export const getFilesList = () => {
	return axiosInstance.get('/files/list');
}

export const downloadFile = (hash: string) => {
	return axiosInstance.get('/files/download/'+hash, {
		responseType: 'blob'
	});
}
