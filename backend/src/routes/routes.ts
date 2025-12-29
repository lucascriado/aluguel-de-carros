import { Router } from 'express';
import usersController from '../controllers/usersController';
import vehiclesController from '../controllers/vehiclesController';
import Auth from "../middlewares/auth";

const router = Router();

// users

router.get("/usuarios/lista", Auth, usersController.List);

router.get("/usuarios/encontrar-usuario", usersController.FindUser);

router.post("/usuarios/cadastrar", usersController.Register)

router.post("/usuarios/entrar", usersController.Login);

// vehicles

router.post("/veiculos/marcas", vehiclesController.CriarMarca)

router.post("/veiculos/modelos", vehiclesController.CriarModelo)

router.post("/veiculos/cores", vehiclesController.CriarCor)

router.post("/veiculos/veiculos", vehiclesController.CriarVeiculo)

export default router;
