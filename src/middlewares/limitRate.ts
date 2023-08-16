import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3, 
    handler: (req: Request, res: Response) => {
        return res.status(429).json({ limitError: 'Você ultrapassou o número máximo de tentativas de login. Tente novamente em uma hora' });
    }
});
