"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
            directory: path_1.default.resolve(__dirname, 'src', 'db', 'migrations'),
            extension: 'ts'
        },
        seeds: {
            directory: path_1.default.resolve(__dirname, 'src', 'db', 'seeds'),
            extension: 'ts'
        }
    }
};
exports.default = config;
