import express, {Request, Response} from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import mustache from 'mustache-express';
import cookieParser from 'cookie-parser';

import mainRoutes from './routes/mainRoutes'

dotenv.config();

const server = express();

server.set('view engine', 'mustache');
server.set('views', path.join(__dirname, 'views'));
server.engine('mustache', mustache());

server.use(cookieParser());
server.use(cors());
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({extended: true}));
server.use(passport.initialize())
server.use(mainRoutes);

server.use('/', (req: Request, res: Response) => {
    res.status(404).send('Página não encontrada');
})

server.listen(process.env.PORT);