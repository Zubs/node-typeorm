import express from 'express';
import bodyParser from "body-parser";
import "reflect-metadata";
import 'dotenv/config';
import { initializeDB } from "./util/database";
import appRoutes from './routes/appRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

initializeDB();

app.use(bodyParser.json());
app.use(appRoutes);
app.use(authRoutes);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
