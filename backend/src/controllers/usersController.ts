import connection from '../db/connection';
import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export default class usersController {

  static async List(req, res) {
    try {
      const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM usuarios ORDER BY id ASC");
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "erro ao buscar usuários" });
    }
  }

  static async FindUser(req, res) {
    try {
      const { cpf } = req.query;

      if (!cpf) {
        return res.status(400).json({ error: "cpf não informado" });
      }

      const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM usuarios WHERE cpf = ?", [cpf]);

      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "erro ao buscar usuários" });
    }
  }

  static async Register(req, res) {
    try {
      const { cpf, nome, email, senha, cargo } = req.body;

      if (!cpf || !nome || !email || !senha || !cargo) {
        return res.status(400).json({ error: "campos obrigatórios faltando" });
      }

      const [existingEmail] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]
      );

      const [existingCpf] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM usuarios WHERE cpf = ?",
        [cpf]
      );

      const [existingName] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM usuarios WHERE nome = ?",
        [nome]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({ error: "e-mail já cadastrado" });
      }

      if (existingCpf.length > 0) {
        return res.status(400).json({ error: "cpf já cadastrado" });
      }

      if (existingName.length > 0) {
        return res.status(400).json({ error: "nome já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO usuarios (cpf, nome, email, senha, cargo) VALUES (?, ?, ?, ?, ?)",
        [cpf, nome, email, hashedPassword, cargo]
      );

      return res.status(201).json({
        message: `usuário cadastrado com sucesso`,
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "erro ao cadastrar usuário" });
    }
  }
}