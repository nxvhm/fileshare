import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserTokenData } from "../definitions";
import "reflect-metadata"

@Entity("users")
export class User {

	@PrimaryColumn("int")
	id!: number

	@Column("varchar")
	name!: string

	@Column("varchar")
	email!: string

	@Column("varchar")
	password!: string

	@Column("timestamp")
	created_at!: string

	@Column("datetime")
	updated_at!: string

	public getTokenData(): UserTokenData {
		return {
			id: this.id,
			name: this.name,
			email: this.email
		}
	}

}
