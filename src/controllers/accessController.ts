import { Request, Response } from "express";
import { User } from "../models/user";

import { generateToken } from "../config/passport";

export const loginForm = async (req:Request, res:Response) => {
    /*
    if(req.body.email && req.body.password) {
        let email:string = req.body.email;
        let password:string = req.body.password;

        let hasUser = await User.findOne({
            where: {
                email
            }
        })

        if(!hasUser) {
            let newUser = await User.create({email, password})

            const token = generateToken({id: newUser.id})

            console.log(token)
            res.json({token})
        } else {
            console.log('O usuário já está cadasrtrado!');
        }
    }
    */

    res.render('pages/login');
}

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let email:string = req.body.email;
        let password:string = req.body.password;
        
        let user = await User.findOne({
            where: {
                email,
                password
            }
        })

        if(user) {
            const token = generateToken({id: user.id})

            console.log(token);
            res.cookie('token', token, {httpOnly: true});
            res.redirect('/logado');
        } else {
            console.log('O usuário não existe');
        }
    } else {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }  
};

export const logado = async (req:Request, res:Response) => {
    res.render('pages/loged')
}