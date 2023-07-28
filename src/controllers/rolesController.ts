import { Request, Response } from "express";
import { Schedule } from "../models/schedules";
import sequelize, { Op } from "sequelize";
import { UserInstance } from "../models/user";

// Controller do usuário
export const user = async (req: Request, res: Response) => {
    if((req.user as UserInstance).email && (req.user as UserInstance).id && req.body.date && req.body.hour) {
        let email:string = (req.user as UserInstance).email;
        let user_id:number = (req.user as UserInstance).id;
        let date:string = req.body.date;
        let hour:string = req.body.hour;

        await Schedule.create({
            email,
            user_id,
            date,
            hour
        })
    } 

    res.render('pages/user');
} 

// Controller do admin
export const admin = async (req: Request, res: Response) => {
    // Pega a data atual
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);

    // Pega todos agendamentos feitos na data atual
    const todayList = await Schedule.findAll({
        where: {
            date: {
                [Op.eq]: sequelize.literal(`DATE('${formattedDate}')`),
            }
        }
    });

    // Agendamentos dos dias seguintes
    const list = await Schedule.findAll({
        where: {
            date: {
                [Op.gt]: sequelize.literal(`DATE('${formattedDate}')`)
            }
        }
    });

    res.render('pages/admin', {list, todayList, formattedDate});
}

export const search = async (req: Request, res: Response) => {
   let searchedDate: string = req.query.search as string;
   
   const list = await Schedule.findAll({
       where: {
           date: {
               [Op.eq]: sequelize.literal(`DATE('${searchedDate}')`)
           } 
       } 
   }) 

   if(!searchedDate) {
       res.redirect('/admin');
       return;  
   }

   res.render('pages/search', {searchedDate, list});
}