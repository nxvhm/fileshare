import 'dotenv/config'
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
	type: "mysql",
	host: "localhost",
	port: Number(process.env.MYSQL_PORT),
	username: String(process.env.MYSQL_USER),
	password: String(process.env.MYSQL_PASSWORD),
	database:  String(process.env.MYSQL_DATABASE),
	synchronize: false,
	logging: true,
	entities: ["./src/models/*{.ts,.js}", "./src/models/**/*{.ts,.js}"],
	subscribers: [],
	migrations: ["./src/migrations/*{.ts,.js}"],
})
