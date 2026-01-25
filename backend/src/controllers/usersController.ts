import connection from '../db/connection';
import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const jwt = require("jsonwebtoken");

export default class usersController {

  static async List(req, res) {
    try {
      const [rows] = await connection.query<RowDataPacket[]>("SELECT id, nome, email, cpf, created_at FROM usuarios ORDER BY id ASC");
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "erro ao buscar usuários" });
    }
  }

  static async Register(req, res) {
    try {
      const { cpf, nome, email, senha } = req.body;

      if (!cpf || !nome || !email || !senha) {
        return res.status(400).json({ error: "campos obrigatórios faltando" });
      }

      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(cpf)) {
        return res.status(400).json({ error: "formato de CPF inválido. Use: 000.000.000-00" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "formato de e-mail inválido" });
      }

      const [existingEmail] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({ error: "e-mail já cadastrado" });
      }

      const [existingCpf] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM usuarios WHERE cpf = ?",
        [cpf]
      );

      if (existingCpf.length > 0) {
        return res.status(400).json({ error: "cpf já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO usuarios (cpf, nome, email, senha) VALUES (?, ?, ?, ?)",
        [cpf, nome, email, hashedPassword]
      );

      return res.status(201).json({
        message: "usuário cadastrado com sucesso",
        usuario: {
          id: result.insertId,
          nome,
          email,
          cpf
        }
      });

    } catch (err) {
      console.error("erro no register:", err);
      return res.status(500).json({ error: "erro ao cadastrar usuário" });
    }
  }

  static async Login(req, res) {
    try {
      const { cpf, senha } = req.body;

      if (!cpf || !senha) {
        console.log('campos faltando');
        return res.status(400).json({ error: "cpf e senha são obrigatórios" });
      }

      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(cpf)) {
        console.log('formato de CPF inválido');
        return res.status(400).json({ error: "formato de CPF inválido. use: 000.000.000-00" });
      }

      const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM usuarios WHERE cpf = ?",
        [cpf]
      );

      console.log('usuários encontrados:', rows.length);

      if (rows.length === 0) {
        console.log('usuário não encontrado');
        return res.status(404).json({ error: "usuário não encontrado" });
      }

      const usuario = rows[0];
      console.log('usuário encontrado:', usuario.nome);
      console.log('hash no banco:', usuario.senha);

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      console.log('senha válida?', senhaValida);

      if (!senhaValida) {
        console.log('senha incorreta');
        return res.status(401).json({ error: "senha incorreta" });
      }

      console.log('✅ Login bem-sucedido');

      const token = jwt.sign(
        {
          id: usuario.id,
          cpf: usuario.cpf,
          nome: usuario.nome,
          email: usuario.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      return res.json({
        message: "login realizado com sucesso",
        token,
        usuario: {
          id: usuario.id,
          cpf: usuario.cpf,
          nome: usuario.nome,
          email: usuario.email
        }
      });

    } catch (err) {
      console.error("erro no Login:", err);
      return res.status(500).json({ error: "erro ao realizar login" });
    }
  }

  static async ResetPassword(req, res) {
    console.log('ResetPassword')
  }
}