import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { User } from "../models/user";

export const register = async (req: Request, res: Response) => {
    try {
        console.log("CORPO DA REQUISIÇÃO:", req.body);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }

        const name: string = req.body.name;
        const date: string = req.body.date;
        const email: string = req.body.email;
        const phone: string = req.body.phone;
        const password: string = req.body.password;

        const user = await User.findOne({
            where: {
                email,
                phone
            }
        })

        if(!user) {
            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({
                name,
                date,
                email,
                phone,
                password: hashedPassword
            });

            return res.status(200).json({ ok:  "Cadastro realizado com sucesso" });
        } else {
            return res.status(400).json({error: 'Usuário já existe na base de dados!'})
        }
    } catch (err) {
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.' });
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