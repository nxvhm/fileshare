import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata"

export enum FileTypes  {
	TYPE_FILE = "file",
	TYPE_FOLDER = "folder"
}

@Entity("files")
export class File {

	@PrimaryGeneratedColumn()
	id!: number

	@Column("int")
	user_id!: number

	@Column("varchar")
	name!: string

	@Column("bigint")
	parent_id!: number|null

	@Column("varchar")
	hash!: string

	@Column("varchar")
	mime!: string

	@Column({
		type: "enum",
		enum: FileTypes,
		default: FileTypes.TYPE_FILE
	})
	type!: FileTypes

	@Column("datetime")
	created_at!: string
}
