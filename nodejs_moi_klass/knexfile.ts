import * as dotenv from 'dotenv';
import type { Knex } from 'knex';
import path from 'path';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'db', 'migrations'),
      extension: 'ts'
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'db', 'seeds'),
      extension: 'ts'
    }
  }
};

export default config;
