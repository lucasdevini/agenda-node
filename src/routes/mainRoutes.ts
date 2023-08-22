import { Router } from "express";

import * as authController from '../controllers/authController';
import * as rolesController from '../controllers/rolesController';
import { authenticate, privateRoute, adminPrivateRoute } from "../passport";
import { userSignUpValidation } from "../validations/userSignUp";
import { scheduleValidation } from "../validations/schedule";
import { userSignInValidation } from "../validations/userSignIn";
import { forgotPasswordValidation } from "../validations/forgotPassword";
import { questionValidation } from "../validations/question";
import { limiter } from "../middlewares/limitRate";
import { answerQuestionMiddleare } from '../middlewares/resetPasswordMiddlewares'

const router = Router();

// rotas de registro
router.get('/register', authController.signUpPage)
router.post('/register', userSignUpValidation, authController.signUp);

// rotas de login
router.get('/login', authController.signInPage);
router.post('/login', limiter, userSignInValidation, authenticate());

// Rotas de usuário
router.get('/user', privateRoute, rolesController.userPage);

router.get('/schedule-form', privateRoute, rolesController.scheduleFormPage);
router.post('/schedule-form', privateRoute, scheduleValidation, rolesController.scheduleForm); 

router.get('/my-schedules', privateRoute, rolesController.mySchedules)

// Rotas de admin
router.get('/admin', adminPrivateRoute, rolesController.adminPage);

router.get('/pending-schedules', adminPrivateRoute, rolesController.pendingSchedules);
router.post('/pending-schedules', adminPrivateRoute, rolesController.acceptOrRefuseSchedule);

router.get('/confirmed-schedules', adminPrivateRoute, rolesController.confirmedSchedules);

router.get('/search-pending', adminPrivateRoute, rolesController.searchPending);
router.get('/search-confirmed', adminPrivateRoute, rolesController.searchConfirmed);

// Rota "esqueci minha senha"
router.get('/forgot-password', authController.forgotPasswordPage);
router.post('/forgot-password', limiter, forgotPasswordValidation, authController.forgotPassword);

// Rota "perguntas de segurança"
router.get('/question', answerQuestionMiddleare, authController.questionPage);
router.post('/question', answerQuestionMiddleare, limiter, questionValidation, authController.question);

// Rota de logout
router.post('/logout', authController.logout);

export default router;