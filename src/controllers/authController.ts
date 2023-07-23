import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';

import { User } from "../models/user";

export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        try {
            let email:string = req.body.email;
            let password:string = req.body.password;

            const hashedPassword = await bcrypt.hash(password, 10);

            User.create({
                email,
                password: hashedPassword
            })

            res.redirect('/login');
        } catch(err) {
            console.log(err);
            res.redirect('/register');
        }
    } else {
        console.log('Informe seu email e sua senha!');
        res.redirect('/register');
    } 
}

export const registerPage = (req: Request, res: Response) => {
    res.render('pages/register');
}

export const loginPage = (req: Request, res: Response) => {
    res.render('pages/login');
}

export const logado = async (req:Request, res:Response) => {
    res.render('pages/loged')
}