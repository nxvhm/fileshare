import "reflect-metadata"
import { Column, Entity, PrimaryColumn , OneToOne, JoinColumn, ManyToOne, Relation} from "typeorm";
import { File } from "@/models/File.js";
import { User } from "@/models/User.js";


@Entity("shares")
export class Share {

	@PrimaryColumn("int")
	user_id!: number;

	@PrimaryColumn("int")
	file_id!: number;

	@ManyToOne(() => User)
	@JoinColumn({name: 'user_id'})
	user!: Relation<User>

	@Column("timestamp")
	created_at!: string

	@OneToOne(() => File)
	@JoinColumn({name: 'file_id'})
	file!: Relation<File>
}
