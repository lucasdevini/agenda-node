import { Request, Response, NextFunction } from 'express';
import { Strategy as LocalStrategy }  from 'passport-local';
import bcrypt from 'bcrypt';
import passport from "passport";
import { validationResult } from 'express-validator';

import { User, UserInstance } from './models/user';

export function initialize(passport:any) {
    async function findUser(email:string) {
        return await User.findOne({
            where: {
                email: email.toLocaleLowerCase()
            }
        })
    }

    async function findUserById(id:number) {
        return await User.findByPk(id);
    }

    passport.serializeUser((user:any, done:any) => {
        done(null, user.id);
    })

    passport.deserializeUser(async (id:any, done:any) => {
        try {
            const user = await findUserById(id);
            done(null, user)
        } catch(err) {
            console.log(err);
            return done()
        }
    })

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

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);

                console.log(errorMessages)

                return res.status(400).json({ errors: errorMessages });
            } 
            
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