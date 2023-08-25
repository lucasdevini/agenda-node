import { body } from "express-validator";

export const questionValidation = [
    body("answer1")
        .trim()
        .notEmpty().withMessage('A resposta não pode estar em branco.')
        .if(body("answer1").notEmpty())
            .isLength({ min: 3, max: 30 }).withMessage('A resposta deve ter entre 3 e 30 caracteres.')
            .if(body("answer1").isLength({ min: 3, max: 30 }))
                .matches(/^[a-zA-ZÀ-ÿ0-9\s-]+$/).withMessage('A resposta deve conter apenas letras, números, espaços e/ou hífens.'),
    body("answer2")
        .trim()
        .notEmpty().withMessage('A resposta não pode estar em branco.')
        .if(body("answer2").notEmpty())
            .isLength({ min: 3, max: 30 }).withMessage('A resposta deve ter entre 3 e 30 caracteres.')
            .if(body("answer2").isLength({ min: 3, max: 30 }))
                .matches(/^[a-zA-ZÀ-ÿ0-9\s-]+$/).withMessage('A resposta deve conter apenas letras, números, espaços e/ou hífens.'),
]