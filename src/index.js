import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';
import path from 'path'; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Configure o Express para servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname,  'uploads')));

app.use('/', router);

app.listen(3001);
console.log("servidor iniciou");