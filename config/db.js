import pg from "pg";
import env from "dotenv";

env.config();

//configuration for using the database

const db = new pg.Client({
    user : process.env.POSTGRES_USER,
    database : process.env.POSTGRES_DATABASE,
    host : process.env.POSTGRES_HOST,
    password : process.env.POSTGRES_PASSWORD,
    port : process.env.POSTGRES_PORT,
});

db.connect()

export default db;