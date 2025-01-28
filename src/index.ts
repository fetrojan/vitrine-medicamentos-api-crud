import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import express from 'express';
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

AppDataSource.initialize()
    .then(async () => {
        app.listen(3000, () => {
            console.log('Banco de dados conectado com sucesso.');
            console.log('Servidor rodando na porta 3000.');
        })
    })
    .catch(error => console.log(error));
