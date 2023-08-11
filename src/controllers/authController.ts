import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { User } from "../models/user";

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        const errorMessages = errors.array().map(error => error.msg);

        if (!errors.isEmpty()) {
            return res.render('pages/register', { errors: errorMessages });
        }

        const email: string = req.body.email;
        const password: string = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword
        });

        const successMessage = 'Cadastro realizado com sucesso!';
        return res.redirect(`/login?success=${encodeURIComponent(successMessage)}`);
    } catch (err) {
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.' });
        return res.redirect('/register');
    }
};

export const registerPage = (req: Request, res: Response) => {
    res.render('pages/register');
}

export const loginPage = (req: Request, res: Response) => {
    const successRegisterMessage = req.query.success as string;
    
    res.render('pages/login', { successRegisterMessage});
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if(err) { return next(err); }
        
        res.redirect('/login');
    });
};