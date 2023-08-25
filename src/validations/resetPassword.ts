import { body } from "express-validator";

export const resetPasswordValidation = [
    body("newPassword")
        .notEmpty()
        .if(body("newPassword").notEmpty())
            .isLength({min: 8, max: 16}).withMessage("A senha deve conter entre 8 e 16 caracteres")  
            .if(body("newPassword").isLength({min: 8, max: 16})) 
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/).withMessage('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),
    body("confirmPassword")
        .notEmpty()
        .if(body("confirmPassword").notEmpty())
            .isLength({min: 8, max: 16}).withMessage("A senha deve conter entre 8 e 16 caracteres")  
            .if(body("confirmPassword").isLength({min: 8, max: 16})) 
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/).withMessage('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.')
]