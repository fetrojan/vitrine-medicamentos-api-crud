import dotenv from "dotenv"
dotenv.config()

import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database/data-source';
import cors from "cors"

import userRouter from './database/routes/user.routes';
import authRouter from './database/routes/auth.routes';
import medicamentoRouter from './database/routes/medicamentos.routes';

import { Role } from './database/entities/Role';
import { User } from './database/entities/User';

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRouter)
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
