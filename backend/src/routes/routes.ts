import { Router } from 'express';
import usersController from '../controllers/usersController';
import Auth from "../middlewares/auth";

const router = Router();

router.get("/usuarios/lista", Auth, usersController.List);

router.post("/usuarios/cadastrar", usersController.Register);

router.post("/usuarios/entrar", usersController.Login);

router.post("/usuarios/resetarsenha", usersController.ResetPassword);

router.get("/ping", (req, res) => {
  res.status(200).json({ message: "ok, everything seems to be working fine ;D" });
});

export default router;