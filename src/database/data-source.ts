import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres', 
    database: 'projeto-semana07',
    synchronize: true,
    logging: false,
    entities: ["src/database/entities/*.ts"],
    migrations: ["src/database/migrations/*.ts"],
    subscribers: [],
});
