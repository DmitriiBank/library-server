
import mysql from 'mysql2/promise'
import dotenv from "dotenv";

export const PORT=3555;
export const baseUrl = `http://localhost:${PORT}`;

export const db = `mongodb+srv://dmitriibank:jhBM7cjQpis5Gmls@cluster0.vwocpad.mongodb.net/dblibrary?retryWrites=true&w=majority&appName=Cluster0`;
dotenv.config();
//========mySQL Connection======
//===============mySQL Connection================
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

export const SKIP_ROUTES = [
    "POST/accounts", "GET/api/books"
]

const connection = await pool.getConnection();