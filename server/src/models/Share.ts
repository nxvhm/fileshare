import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserTokenData } from "../definitions";
import "reflect-metadata"


@Entity("shares")
export class Share {
	@PrimaryColumn("int")
	user_id!: number;

	@PrimaryColumn("int")
	file_id!: number;
}
