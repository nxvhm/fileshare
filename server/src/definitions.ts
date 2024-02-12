import express from "express";

export type UserTokenPayload = {
	data: {
		id: number,
		name: string,
		email: string
	},
	iat: number,
	exp: number
}

export interface IUserAuthRequest extends express.Request {
  user?: UserTokenPayload // or any other type
}
