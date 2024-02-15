import express from "express";


export type UserTokenData = {
	id: number,
	name: string,
	email: string
}

export type UserTokenPayload = {
	data: UserTokenData
	iat: number,
	exp: number
}

export interface IUserAuthRequest extends express.Request {
  user?: UserTokenPayload // or any other type
}
