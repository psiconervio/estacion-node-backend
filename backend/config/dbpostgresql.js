// db.js
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// Usar la variable de entorno para la URL de la base de datos
const sql = postgres(process.env.DATABASE_URL, {
  host: process.env.DB_HOST || "", // Postgres ip address[s] or domain name[s]
  port: process.env.DB_PORT || 5432, // Postgres server port[s]
  database: process.env.DB_DATABASE || "", // Name of database to connect to
  username: process.env.DB_USERNAME || "", // Username of database user
  password: process.env.DB_PASSWORD || "", // Password of database user
});

export default sql;
