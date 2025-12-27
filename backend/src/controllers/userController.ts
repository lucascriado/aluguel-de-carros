import connection from '../db/connection';
import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export default class userController {

  static async getAllUsers(req, res) {
    try {
      const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM users");
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "erro ao buscar usuários" });
    }
  }

  static async registerUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "campos obrigatórios faltando" });
      }

      const [existing] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: "e-mail já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role || "usuario"]
      );

      return res.status(201).json({
        message: "usuário cadastrado com sucesso",
        userId: result.insertId,
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "erro ao cadastrar usuário" });
    }
  }
}