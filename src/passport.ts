import { Request, Response, NextFunction } from 'express';
import { Strategy as LocalStrategy }  from 'passport-local';
import bcrypt from 'bcrypt';
import passport, { PassportStatic } from "passport";
import { validationResult } from 'express-validator';

import { User, UserInstance } from './models/user';

export function initialize(passport:PassportStatic) {
    // Encontra o usuário baseado no email
    async function findUser(email:string) {
        return await User.findOne({
            where: {
                email: email.toLocaleLowerCase()
            }
        })
    }

    // Encontra o usuário baseado no id
    async function findUserById(id:number) {
        return await User.findByPk(id);
    }

    // salva o id do usuário na sessão
    passport.serializeUser((user: any, done: (err: any, id?: number) => void) => {
        done(null, user.id);
    })

    // recupera todos os detalhes do usuário a partir da sessão
    passport.deserializeUser(async (id:number, done: (err: any, user?: UserInstance | null) => void) => {
        try {
            const user = await findUserById(id);
            done(null, user)
        } catch(err) {
            return done(err);
        }
    })
    
    // Verifica a existência do usuário com base no email e senha enviados pelo form
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email:string, password:string, done) => {
        try {
            const user = await findUser(email);

            if (!user) {
                return done(null, false, { message: 'Usuário não encontrado.' });
            }
            
            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                return done(null, false, { message: 'Senha incorreta.' });
            }

            return done(null, user);
        } catch(err) {
            console.log(err);
            return done(err, false);
        }
    }))
}

export function authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error, user: UserInstance | false, info: any) => {
            if (err) {
                return next(err);
            }

            const errors = validationResult(req);

            // Caso haja algum de validação, é informado aqui
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);

                return res.status(400).json({ errors: errorMessages });
            } 
            
            // Retorna erro caso o usuário não exista
            if (!user) {
                return res.status(400).json({error: info.message})
            }

            // preenche req.user
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                // Verifica a role do usuário logado
                const userRole: string = (req.user as UserInstance).role;

                // Redireciona de acordo com a role
                if (userRole === 'admin') {
                    res.status(200).json({admin: 'Usuário logado com suceso!'})
                } else {
                    res.status(200).json({user: 'Usuário logado com suceso!'})
                }
            });
        })(req, res, next);
    };
}

export function privateRoute(req: Request, res: Response, next: NextFunction) {
    if(req.isAuthenticated()) return next();
    
    res.redirect('/login');
}

export function adminPrivateRoute(req: Request, res: Response, next: NextFunction) {
    if(req.isAuthenticated() && (req.user as UserInstance).role === 'admin') {
        return next();
        
    } else if(req.isAuthenticated() && (req.user as UserInstance).role !== 'admin') {
        res.send('Você não tem permissão para acessar essa rota');
    }

    res.redirect('/login');
}