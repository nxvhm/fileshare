import "reflect-metadata"
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from "typeorm";
import { Files } from "../lib/FilesHelper.js";
import { PathLike } from "fs";
import { createHash } from "crypto";
import { FileTypes } from '@/definitions.js'
import { User } from "./User.js";

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

	@Column("bigint")
	filesize!: number

	@Column({
		type: "enum",
		enum: FileTypes,
		default: FileTypes.TYPE_FILE
	})
	type!: FileTypes

	@Column("int")
	public!:  number

	@Column("datetime")
	created_at!: string

	@ManyToOne(() => User, (user) => user.files)
	@JoinColumn({name: 'user_id'})
	user!: Relation<User>

	public static viewableMimeTypes = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
		'application/pdf',
		'application/json'
	];

	public static textMimeTypes = [
		'text/html', 'text/plain', 'text/csv', 'application/json'
	];

	public getPath(): PathLike|string {
		return Files.getUserFilesDirPath(this.hash, this.user_id);
	}

	public isViewable(): boolean {
		return this.mime ? File.viewableMimeTypes.includes(this.mime) : false;
	}

	public isText(): boolean {
		return this.mime ? File.textMimeTypes.includes(this.mime) : false;
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
