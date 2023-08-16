import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3, 
    handler: (req: Request, res: Response) => {
        const limitMessage = 'Limite máximo de tentativas de login excedido! Tente novamente depois.'

        res.render("pages/login", { limitMessage })
    }
});
