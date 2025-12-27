import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1832',
  database: 'aluguel_de_carros',
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