import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.getConnection()
  .then(connection => {
    console.log("conexão com sucesso");
    connection.release();
  })
  .catch(err => {
    console.error("erro na conexão:", err);
  });

export default connection;