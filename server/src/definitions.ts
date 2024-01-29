import express from "express";

export type UserTokenPayload = {
	id: number,
	name: string,
	email: string
}

export interface IUserAuthRequest extends express.Request {
  user?: UserTokenPayload // or any other type
}
