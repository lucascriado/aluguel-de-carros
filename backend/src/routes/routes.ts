import { Router } from 'express';
import usersController from '../controllers/usersController';

const router = Router();

// => /usuarios/

router.get("/usuarios/lista", usersController.List);

router.get("/usuarios/encontrar-usuario", usersController.FindUser);

router.post("/usuarios/cadastrar", usersController.Register)

export default router;
