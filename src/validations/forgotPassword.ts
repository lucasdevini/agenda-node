import { body } from "express-validator";

export const forgotPasswordValidation = [
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
          .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/).withMessage('O número de telefone deve estar no formato (xx) xxxxx-xxxx.')
]