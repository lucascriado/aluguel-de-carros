import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.get("/users/getall", userController.getAllUsers);

router.post("/users/register", userController.registerUser)

export default router;
