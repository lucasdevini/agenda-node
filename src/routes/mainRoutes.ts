import { Router } from "express";

import * as accessController from '../controllers/accessController';
import * as rolesController from '../controllers/rolesController';
import { privateRoute } from "../config/passport";

const router = Router();

// Rotas de autenticação
router.get('/login-form', accessController.loginForm);
router.post('/login', accessController.login);
router.get('/logado', privateRoute, accessController.logado)

// Rotas de usuário
router.get('/user', rolesController.user);
router.post('/user', rolesController.user); 

// Rotas de admin
router.get('/admin', rolesController.admin);
router.get('/search', rolesController.search);

export default router;