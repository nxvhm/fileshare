import axios from "axios"

type signupData = {
	name: string,
	email: string,
	password: string,
	password_repeat: string
}

type loginData = {
	email: string,
	password: string
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export type SignupResponse = {
	success: boolean,
	message: undefined|string
}

export type LoginResponse = {
	token: undefined|string,
	message?: string
}

export const signupRequest = (data:signupData):Promise<SignupResponse> => {
	return new Promise((resolve, reject) => {
		axios.post('/auth/signup', data)
		.then(
			res => res.status == 200
				? resolve({success: true, message: "Signup Successfull"})
				: reject(new Error(res.data?.message))
		).catch(
			e => reject(new Error(e.response?.data?.message ?? e.message))
		);
	});
}

export const loginRequest = (data:loginData):Promise<LoginResponse> => {
	return new Promise((resolve, reject) => {
		axios.post('/auth/login', data)
		.then(
			res => res.status == 200 && res.data.token
				? resolve({token: String(res.data.token)})
				: reject(new Error(res.data?.message))
		).catch(
			e => reject(new Error(e.response?.data?.message ?? e.message))
		)
	})
}


