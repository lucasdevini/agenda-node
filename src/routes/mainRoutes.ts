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
router.get('/user', privateRoute, rolesController.userPage);

router.get('/schedule-form', privateRoute, rolesController.scheduleForm);
router.post('/schedule-form', privateRoute, rolesController.scheduleForm); 

router.get('/my-schedules', privateRoute, rolesController.mySchedules)

// Rotas de admin
router.get('/admin', adminPrivateRoute, rolesController.adminPage);

router.get('/pending-schedules', adminPrivateRoute, rolesController.pendingSchedules);
router.get('/confirmed-schedules', adminPrivateRoute, rolesController.confirmedSchedules);

router.post('/admin', adminPrivateRoute, rolesController.acceptOrRefuseSchedule);

router.get('/search-pending', adminPrivateRoute, rolesController.searchPending);
router.get('/search-confirmed', adminPrivateRoute, rolesController.searchConfirmed);

// Rota de logout
router.post('/logout', authController.logout);

export default router;