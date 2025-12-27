import { Router } from 'express';
import usersController from '../controllers/usersController';
import Auth from "../middlewares/auth";

const router = Router();

router.get("/usuarios/lista", Auth, usersController.List);

router.get("/usuarios/encontrar-usuario", usersController.FindUser);

router.post("/usuarios/cadastrar", usersController.Register)

router.post("/usuarios/entrar", usersController.Login);

export default router;
