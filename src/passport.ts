import { Request, Response, NextFunction } from 'express';
import { Strategy as LocalStrategy }  from 'passport-local';
import bcrypt from 'bcrypt';

import { User } from './models/user';

export function initialize(passport:any) {
    async function findUser(email:string) {
        return await User.findOne({
            where: {
                email
            }
        })
    }

    async function findUserById(id:number) {
        return await User.findByPk(id);
    }

    passport.serializeUser((user:any, done:any) => {
        done(null, user.id);
    })

    passport.deserializeUser((id:any, done:any) => {
        try {
            const user = findUserById(id);
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
            if(!user) return done(null, false);
            
            const isValid = await bcrypt.compare(password, user.password);

            if(!isValid) return done(null, false);
            return done(null, user);
        } catch(err) {
            console.log(err);
            return done(err, false);
        }
    }))
}

export function privateRoute(req: Request, res: Response, next: NextFunction) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

