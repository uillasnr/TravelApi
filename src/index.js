import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router); // Use a rota base "/" para as rotas

app.listen(3001);
console.log("servidor iniciou");