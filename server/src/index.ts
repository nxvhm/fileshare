import "dotenv/config"
import "reflect-metadata"
import bodyParser from "body-parser";
import express, { Request, Response } from 'express';
import AuthController from './controllers/Auth';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/auth', AuthController);
app.get('/', (req: Request, res: Response) => {
    res.send('Hello TS');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
