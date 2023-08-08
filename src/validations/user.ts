import { body } from "express-validator";

export const userValidation = [
    body("email").notEmpty().withMessage("Email obrigatório!").isEmail().trim(),
    body("password")
        .notEmpty().withMessage("Senha obrigatória!")
        .isLength({min: 8, max: 16}).withMessage("A senha deve conter entre 8 e 16 caracteres")   
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),
]