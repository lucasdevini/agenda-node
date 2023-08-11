import { body } from "express-validator";

export const scheduleValidation = [
    body("date").notEmpty().withMessage("Data obrigatória!")
      .isISO8601().withMessage("Data inválida!")
      .trim(),
    body("hour")
      .notEmpty().withMessage("Hora obrigatória!")
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "i").withMessage("Hora inválida (formato esperado: HH:mm)")
      .trim()
]