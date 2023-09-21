import { Request, Response, NextFunction } from "express";

// middleware que redireciona os usuários de forgot-password para question
export const answerQuestionMiddleare = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.user_id) {
        next(); 
    } else {
        res.redirect('/forgot-password');
    }
}

// middleware que redireciona os usuários de question para resetPassword
export const resetPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.cookies.reset_password) {
        next();
    } else {
        res.redirect('/question')
    }
}