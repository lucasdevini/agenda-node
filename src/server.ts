import express, {Request, Response} from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import mustache from 'mustache-express';
import cookieParser from 'cookie-parser';

import { initialize as auth } from './passport'; 
auth(passport);

import mainRoutes from './routes/mainRoutes'

dotenv.config();

const server = express();

// Definindo e utilizando o mustache
server.set('view engine', 'mustache');
server.set('views', path.join(__dirname, 'views'));
server.engine('mustache', mustache());

server.use(express.static(path.join(__dirname, '../public')));

server.use(cookieParser()); 
server.use(cors()); 
server.use(express.urlencoded({extended: true}));
server.use(express.json());

// habilitando as sessões
server.use(session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 2 * 60 * 1000}
}))

// iniciando o passport e as sessões
server.use(passport.initialize())
server.use(passport.session());

// iniciando as rotas (endpoints)
server.use(mainRoutes);
server.use('/', (req: Request, res: Response) => {
    res.status(404).send('Página não encontrada');
})

server.listen(process.env.PORT);