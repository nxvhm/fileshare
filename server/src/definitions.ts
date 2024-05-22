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

export enum FileTypes  {
	TYPE_FILE = "file",
	TYPE_FOLDER = "folder"
}

export enum IS_PUBLIC {
	YES = 1,
	NO = 0
}
