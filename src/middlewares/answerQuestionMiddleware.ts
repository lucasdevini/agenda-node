import { Request, Response, NextFunction } from "express";

export const answerQuestionMiddleare = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.user_authenticated) {
        res.clearCookie('user_authenticated');
        next(); 
    } else {
        res.redirect('/forgot-password');
    }
}