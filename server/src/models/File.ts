import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata"
import { Files } from "../lib/Files";
import { PathLike } from "fs";
import { createHash } from "crypto";
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

	@Column({
		type: "bigint",
		nullable: true
	})
	parent_id!: number | null

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

	public getPath(): PathLike|string {
		return Files.getUserFilesDirPath(this.hash, this.user_id);
	}

	public static generateHash(userId: number, filename: string): Promise<string> {
		const hashStream = createHash('md5');
		hashStream.write(String(userId)+filename+(new Date().valueOf()));
		hashStream.end();
		return new Promise(resolve => {
			hashStream.on('readable', () => resolve(hashStream.read().toString('hex')));
		})
	}
}
