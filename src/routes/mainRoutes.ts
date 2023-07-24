import { Router } from "express";
import passport from "passport";

import * as authController from '../controllers/authController';
import * as rolesController from '../controllers/rolesController';
import { privateRoute } from "../passport";

const router = Router();

// rotas de registro
router.get('/register', authController.registerPage)
router.post('/register', authController.register);

// rotas de login
router.get('/login', authController.loginPage);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login'
}));

// Rotas de usuário
router.get('/user', privateRoute, rolesController.user);
router.post('/user', privateRoute, rolesController.user); 

// Rotas de admin
router.get('/admin', privateRoute, rolesController.admin);
router.get('/search', privateRoute, rolesController.search);

// Rota de logout
router.post('/logout', authController.logout);

export default router;