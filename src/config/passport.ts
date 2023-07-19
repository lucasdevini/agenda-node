import { Request, Response, NextFunction } from "express";
import passport from "passport";
import dotenv from 'dotenv';
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import JWT from 'jsonwebtoken';

import { User} from "../models/user";

dotenv.config();

const notAuthorizedJson = {status: 404, message: 'Não autorizado!'}

const options = {   
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(options, async (payload, done) => {
    const user = await User.findByPk(payload.id);

    if(user) {
        return done(null, user);
    } else {
        return done(notAuthorizedJson, false);
    }
}))

export const generateToken = (data:object) => {
    return JWT.sign(
        data, 
        process.env.JWT_SECRET as string,
        {expiresIn: '2h'})
}

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err:Error, user:Object) => {
        if (err || !user) {
            console.log(user)
            return res.status(401).json({ error: 'Acesso não autorizado' });
        }

        req.user = user;

        return next();
    })(req, res, next);
}

export default passport;