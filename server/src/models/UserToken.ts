import { Column, Entity, PrimaryColumn } from "typeorm";
import "reflect-metadata"

@Entity("user_token")
export class UserToken {

	@PrimaryColumn("int")
	id!: number

	@Column("int")
	user_id!: number

	@Column("varchar")
	token!: string

	@Column("datetime")
	expires_at!: string

	@Column("datetime")
	created_at!: string

}
