import { Request, Response, NextFunction } from "express";

export const answerQuestionMiddleare = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.user_id) {
        next(); 
    } else {
        res.redirect('/forgot-password');
    }
}