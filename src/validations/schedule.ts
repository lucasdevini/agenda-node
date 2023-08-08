import { body } from "express-validator";

export const scheduleValidation = [
    body("date").notEmpty().withMessage("Data obrigatória!")
    .isDate().withMessage("Data inválida!")
    .trim(),
    body("hour")
        .notEmpty().withMessage("Hora obrigatória!")
        .custom((value) => {
            // Verifica se a hora está no formato "HH:mm"
            const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
            if (!timePattern.test(value)) {
              throw new Error("Hora inválida (formato esperado: HH:mm)");
            }
            return true;
          })
        .trim()
]