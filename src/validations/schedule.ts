import { body } from "express-validator";

export const scheduleValidation = [
    body("date")
      .notEmpty()
      .isISO8601().withMessage("Data inválida!"),
    body("hour")
      .notEmpty()
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "i").withMessage("Hora inválida (formato esperado: HH:mm)")
]