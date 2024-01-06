import { Column, Entity, PrimaryColumn } from "typeorm";
import "reflect-metadata"

@Entity("files")
export class File {

	@PrimaryColumn("int")
	id!: number

	@Column("int")
	user_id!: number

	@Column("varchar")
	name!: string

	@Column("varchar")
	hash!: string

	@Column("varchar")
	mime!: string

	@Column("datetime")
	created_at!: string

}
