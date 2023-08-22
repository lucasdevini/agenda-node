import { body } from "express-validator";

export const userSignUpValidation = [
    body("name")
        .trim()
        .notEmpty()
        .if(body("name").notEmpty())
        .isLength({ min: 3, max: 50 }).withMessage('O nome do usuário deve ter entre 3 e 50 caracteres.')
        .matches(/^[a-zA-ZÀ-ÿ\s-]+$/).withMessage('O nome do usuário deve conter apenas letras, espaços e/ou hífens.'),
    body("date")
        .notEmpty()
        .if(body("date").notEmpty())
        .isISO8601().withMessage('A data de nascimento deve ser uma data válida.')
        .custom((value) => {
            const currentDate = new Date();
            const userDate = new Date(value);
            const ageDiff = currentDate.getFullYear() - userDate.getFullYear();
            if (ageDiff < 18) {
              throw new Error('Você deve ter pelo menos 18 anos para se registrar.');
            }
            return true;
          }),
    body("email")
        .trim()
        .notEmpty()
        .if(body("email").notEmpty())
        .isEmail().withMessage("Formato de email não reconhecido"),
    body("phone")
        .trim()
        .notEmpty()
        .if(body("phone").notEmpty())
        .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/).withMessage('O número de telefone deve estar no formato (xx) xxxx-xxxx.'),
    body("password")
        .notEmpty()
        .if(body("password").notEmpty())
        .isLength({min: 8, max: 16}).withMessage("A senha deve conter entre 8 e 16 caracteres")   
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/).withMessage('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),
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