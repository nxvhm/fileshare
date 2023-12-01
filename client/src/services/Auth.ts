import axios from "axios"

type signupData = {
	name: string,
	email: string,
	password: string,
	password_repeat: string
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const signupRequest = (data:signupData) => {
	return new Promise((resolve, reject) => {
		axios.post('/auth/signup', data).then(
			res => res.status == 200 ? resolve({success: true}) : reject({success:false, message: res.data?.message})
		).catch(e => reject({success: false, message: e.response.data?.message}));
	});
}


