import { Router } from "express";

import * as accessController from '../controllers/accessController'
import { privateRoute } from "../config/passport";

const router = Router();

router.get('/login-form', accessController.loginForm);
router.post('/login', accessController.login);
router.get('/logado', privateRoute, accessController.logado)

export default router;