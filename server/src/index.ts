import "dotenv/config"
import "reflect-metadata"
import bodyParser from "body-parser";
import express, { Request, Response } from 'express';
import cors from 'cors'
import AuthController from './controllers/Auth.js';
import { AppDataSource } from "./datasource.js";
import Users from "./controllers/Users.js";
import FilesModuleRouter from '@/controllers/files/index.js';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
try {
	await (async () => {
		AppDataSource.initialize();
	})()
	console.log("Connected to database");
} catch (error) {
	console.log("error connecting to database");
	console.error(error);
}

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/auth', AuthController);
app.get('/', (req: Request, res: Response) => {
    res.send('Hello TS');
});


app.use('/files', FilesModuleRouter);
app.use('/users', Users);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
