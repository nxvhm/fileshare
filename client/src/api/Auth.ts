import {default as axios} from "../lib/Axios";

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

export type SignupResponse = {
	success: boolean,
	message: undefined|string
}

export type LoginResponse = {
	token: string,
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

export const verifyToken = (token:string):Promise<boolean> => {
	return new Promise((resolve, reject) => {
		axios.post('/auth/verify', {token}).then(res => {
			res.status == 200 && res.data.isValid
				? resolve(true)
				: reject(false)
		}).catch(e => reject(new Error(e.response?.data?.msg ?? e.message)));
	})
}


