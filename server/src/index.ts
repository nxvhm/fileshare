import "dotenv/config"
import "reflect-metadata"
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.APP_PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello TS');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
