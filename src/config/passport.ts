import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';

dotenv.config();

export const generateToken = (data:object) => {
    return JWT.sign(
        data, 
        process.env.JWT_SECRET as string,
        {expiresIn: '10s'})
}

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    
    try {
        const user = JWT.verify(token, process.env.JWT_SECRET as string);
        req.user = user;

        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login-form');
    }
}