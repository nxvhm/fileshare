import axios from "axios"

type signupData = {
	name: string,
	email: string,
	password: string,
	password_repeat: string
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export type AuthResponse = {
	success: boolean,
	message: undefined|string
}

export const signupRequest = (data:signupData):Promise<AuthResponse> => {
	return new Promise((resolve, reject) => {
		axios.post('/auth/signup', data).then(
			res => res.status == 200
				? resolve({success: true, message: "Signup Successfull"})
				: reject(new Error(res.data?.message))
		).catch(
			e => reject(new Error(e.response?.data?.message ?? e.message))
		);
	});
}


