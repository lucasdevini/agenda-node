import { Request, Response, NextFunction } from "express";

export const answerQuestionMiddleare = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.user_id) {
        next(); 
    } else {
        res.redirect('/forgot-password');
    }
}

export const resetPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.cookies.reset_password) {
        next();
    } else {
        res.redirect('/question')
    }
}