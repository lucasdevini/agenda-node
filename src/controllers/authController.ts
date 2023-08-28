import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import sequelize, { Op } from "sequelize";

import { sequelize as Sequelize } from "../instances/sql";
import { User } from "../models/user";
import { Question } from "../models/questions";

export const signUp = async (req: Request, res: Response) => {
    const transaction = await Sequelize.transaction();

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => ({
                msg: error.msg,
                path: error.type === 'field' ? error.path : null
        }));

            return res.status(400).json({ errors: errorMessages });
        }

        const name: string = req.body.name;
        const date: string = req.body.date;
        const email: string = req.body.email;
        const phone: string = req.body.phone;
        const password: string = req.body.password;
        const question1: string = req.body.question1;
        const answer1: string = req.body.answer1;
        const question2: string = req.body.question2;
        const answer2: string = req.body.answer2;

        const user = await User.findOne({
            where: {
                email,
                phone
            }
        })

        if(!user) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create(
                {
                    name,
                    date,
                    email,
                    phone,
                    password: hashedPassword
                 },
                 { transaction }
            );

            const hashedAnswer1 = await bcrypt.hash(answer1, 10);

            await Question.create(
                {
                    user_id: user.id,
                    question: question1,
                    answer: hashedAnswer1
                },
                { transaction }
            );

            const hashedAnswer2 = await bcrypt.hash(answer2, 10);

            await Question.create(
                {
                    user_id: user.id,
                    question: question2,
                    answer: hashedAnswer2
                },

                { transaction }
            );

            await transaction.commit();

            return res.status(200).json({ ok:  "Cadastro realizado com sucesso" });
        } else {
            return res.status(400).json({error: 'Usuário já existe na base de dados!'})
        }
    } catch (err) {
        console.log("DEU ERRO AQUI NO CATCH", err)

        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.' });
    }
};

export const signUpPage = (req: Request, res: Response) => {
    res.render('pages/register');
}

export const signInPage = (req: Request, res: Response) => {
    const successRegisterMessage = req.query.success as string;

    res.render('pages/login', { successRegisterMessage});
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if(err) { return next(err); }
        
        res.redirect('/login');
    });
};

export const forgotPasswordPage = (req: Request, res: Response) => {
    res.render("pages/forgotPassword");
}

export const forgotPassword = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    const date = req.body.date;
    const email = req.body.email;
    const phone = req.body.phone;

    const user = await User.findOne({
        where: {
            date: {
                [Op.eq]: sequelize.literal(`DATE('${date}')`)
            },
            email, 
            phone
        }
    })

    if(user) {
        res.cookie('user_id', user.id, { 
            maxAge: 900000,
            httpOnly: true  
        });
        return res.status(200).json({ok: true})
    } else {
        return res.status(400).json({error: 'Usuário inexistente'});
    }
}

export const questionPage = async (req: Request, res: Response) => {
    const userId = req.cookies.user_id;

    const questions = await Question.findAll({
        where: {
            user_id: userId
        }
    });

    const question1 = questions[0]?.question;
    const question2 = questions[1]?.question;

    res.render('pages/question', { question1, question2 });
}

export const question = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }

        const userId = req.cookies.user_id;
        
        const answer1: string = req.body.answer1;
        const answer2: string = req.body.answer2;

        const answers = await Question.findAll({
            where: {
                user_id: userId
            }
        });

        const correctAnswer1 = await bcrypt.compare(answer1, answers[0]?.answer);
        const correctAnswer2 = await bcrypt.compare(answer2, answers[1]?.answer);

        if((correctAnswer1) && (correctAnswer2)) {   
            res.clearCookie('user_id')

            res.cookie('reset_password', userId, { 
                maxAge: 300000,
                httpOnly: true  
            });
            
            return res.status(200).json({ok: true})
        } else {
            return res.status(400).json({error: 'Resposta(s) incorreta(s)!'});
        }
    } catch(err) {
        console.log(err)
    }
}

export const resetPasswordPage = async (req: Request, res: Response) => {
    res.render('pages/resetPassword');
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }

        const userId = req.cookies.reset_password;

        const newPassword: string = req.body.newPassword;
        const confirmPassword: string = req.body.confirmPassword;

        const user = await User.findByPk(userId);
        
        if(user) {
            if(newPassword === confirmPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                const samePasswords = await bcrypt.compare(newPassword, user.password);

                if(samePasswords) {
                    return res.status(400).json({error: 'A senha nova é igual a senha atual do usuário!'});
                } else {
                    await User.update(
                        { password: hashedPassword },
                        {
                            where: {
                                id: userId
                            }
                        }
                    )
                    
                    res.clearCookie('reset_password')

                    return res.status(200).json({success: 'Senha alterada com sucesso!'});
                } 
            } else {
                return res.status(400).json({error: 'As senhas não são iguais.'});
            }
        }
    } catch(err) {
        console.log(err);
    }
}