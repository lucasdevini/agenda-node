import { Router } from "express";

import * as authController from '../controllers/authController';
import * as rolesController from '../controllers/rolesController';
import { authenticate, privateRoute, adminPrivateRoute } from "../passport";

const router = Router();

// rotas de registro
router.get('/register', authController.registerPage)
router.post('/register', authController.register);

// rotas de login
router.get('/login', authController.loginPage);
router.post('/login', authenticate());

// Rotas de usuário
router.get('/user', privateRoute, rolesController.user);
router.post('/user', privateRoute, rolesController.user); 

// Rotas de admin
router.get('/admin', adminPrivateRoute, rolesController.admin);
router.get('/search', adminPrivateRoute, rolesController.search);

// Rota de logout
router.post('/logout', authController.logout);

export default router;