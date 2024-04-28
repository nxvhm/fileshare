import { Column, Entity, PrimaryColumn , OneToOne, JoinColumn} from "typeorm";
import { UserTokenData } from "../definitions.js";
import "reflect-metadata"
import { File } from "@/models/File.js";
import { User } from "@/models/User.js";


@Entity("shares")
export class Share {

	@PrimaryColumn("int")
	user_id!: number;

	@PrimaryColumn("int")
	file_id!: number;

	@OneToOne(() => User)
	@JoinColumn({name: 'user_id'})
	user!: User

	@Column("timestamp")
	created_at!: string

	@OneToOne(() => File)
	@JoinColumn({name: 'file_id'})
	file!: File
}
