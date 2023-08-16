import { body } from "express-validator";

export const userValidation = [
    body("email")
    .trim()
    .notEmpty().withMessage("Email obrigatório!")
    .if(body("email").notEmpty())
    .isEmail().withMessage("Formato de email não reconhecido"),
    body("password")
        .notEmpty().withMessage("Senha obrigatória!")
        .if(body("password").notEmpty())
        .isLength({min: 8, max: 16}).withMessage("A senha deve conter entre 8 e 16 caracteres")   
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/).withMessage('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),
]