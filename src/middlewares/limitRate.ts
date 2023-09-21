import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit'

// Limita o usuário a um máximo de 10 tentativas por hora
export const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10, 
    handler: (req: Request, res: Response) => {
        res.clearCookie('user_id');
        res.clearCookie('reset_password');

        return res.status(429).json({ limitError: 'Você ultrapassou o número máximo de tentativas. Tente novamente em uma hora' });
    },
});
