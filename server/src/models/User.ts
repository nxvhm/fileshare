import "reflect-metadata"
import { Column, Entity, PrimaryColumn, OneToMany, Relation } from "typeorm";
import { UserTokenData } from "../definitions.js";
import { File } from "./File.js";

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

	@OneToMany(() => File, (file) => file.user )
	files!: Relation<File[]>

	public getTokenData(): UserTokenData {
		return {
			id: this.id,
			name: this.name,
			email: this.email
		}
	}
}
