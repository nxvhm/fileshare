import "dotenv/config"
import "reflect-metadata"
import bodyParser from "body-parser";
import express, { Request, Response } from 'express';
import cors from 'cors'
import AuthController from './controllers/Auth';
import { AppDataSource } from "./datasource";
import Upload from "./controllers/Upload";
import FileList from "./controllers/FileList"
import DeleteFile from "./controllers/DeleteFile";
import DownloadFile from "./controllers/DownloadFile";
import Breadcrumbs from "./controllers/Breadcrumbs";
import Users from "./controllers/Users";
import Share from "@/controllers/files/Share";

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

app.use('/upload', Upload);
app.use('/files/list', FileList);
app.use('/files/delete', DeleteFile);
app.use('/files/download', DownloadFile);
app.use('/files/breadcrumbs', Breadcrumbs);
app.use('/files/share', Share);
app.use('/users', Users);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
