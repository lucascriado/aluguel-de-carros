import { Router } from 'express';
import usersController from '../controllers/usersController';
import Auth from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/usuarios/lista:
 *   get:
 *     summary: lista todos os usuários
 *     tags: [usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListaUsuario'
 *       401:
 *         description: não autorizado
 *       500:
 *         description: erro ao buscar usuários
 */
router.get("/usuarios/lista", Auth, usersController.List);

/**
 * @swagger
 * /api/usuarios/encontrar-usuario:
 *   get:
 *     summary: busca um usuário utilizando o cpf
 *     tags: [usuários]
 *     parameters:
 *       - in: query
 *         name: cpf
 *         required: true
 *         example: 110.100.001-11
 *         schema:
 *           type: string
 *         description: cpf do usuário
 *     responses:
 *       200:
 *         description: usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EncontraUsuario'
 *       400:
 *         description: cpf não informado
 *       500:
 *         description: erro ao buscar usuário
 */
router.get("/usuarios/encontrar-usuario", usersController.FindUser);

/**
 * @swagger
 * /api/usuarios/cadastrar:
 *   post:
 *     summary: cadastra um novo usuário
 *     tags: [usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroUsuario'
 *     responses:
 *       201:
 *         description: usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: campos obrigatórios faltando ou dados já cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: erro ao cadastrar usuário
 */
router.post("/usuarios/cadastrar", usersController.Register);

/**
 * @swagger
 * /apis/usuarios/entrar:
 *   post:
 *     summary: realiza entrada de usuário
 *     tags: [usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entrar'
 *     responses:
 *       200:
 *         description: entrada realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: usuário entrou no sistema com sucesso
 *                 token:
 *                   type: string
 *                   example: 9bc439f5-6c7e-4303-a7b2-7cbd6e47c6c5
 *                 usuario:
 *                   example: lucascriado
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: cpf e senha são obrigatórios
 *       401:
 *         description: senha incorreta
 *       404:
 *         description: usuário não encontrado
 *       500:
 *         description: erro ao realizar login
 */
router.post("/usuarios/entrar", usersController.Login);

export default router;