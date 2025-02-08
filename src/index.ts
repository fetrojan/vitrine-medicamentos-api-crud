import dotenv from 'dotenv';
dotenv.config()

import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import express from 'express';
import cors from "cors"
import userRouter from './database/routes/user.routes';
import authRouter from './database/routes/auth.routes';
import medicamentoRouter from './database/routes/medicamentos.routes';

import authenticate from './middleware/authenticate';

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', authenticate, userRouter)
app.use('/login', authRouter)
app.use('/medicamento', medicamentoRouter)

AppDataSource.initialize()
    .then(async () => {
        app.listen(3000, () => {
            console.log('Banco de dados conectado com sucesso.');
            console.log('Servidor rodando na porta 3000.');
        })
    })
    .catch(error => console.log(error));
