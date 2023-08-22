import { body } from "express-validator";

export const questionValidation = [
    body("answer1")
        .trim()
        .notEmpty()
        .if(body("answer1").notEmpty())
        .isLength({ max: 100 }).withMessage('O nome do usuário deve ter entre 3 e 100 caracteres.')
        .matches(/^[a-zA-ZÀ-ÿ\s-]+$/).withMessage('A resposta deve conter apenas letras, espaços e/ou hífens.'),
    body("answer2")
        .trim()
        .notEmpty()
        .if(body("answer2").notEmpty())
        .isLength({ max: 100 }).withMessage('O nome do usuário deve ter entre 3 e 100 caracteres.')
        .matches(/^[a-zA-ZÀ-ÿ\s-]+$/).withMessage('A resposta deve conter apenas letras, espaços e/ou hífens.'),
]