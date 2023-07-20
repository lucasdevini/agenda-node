import { Request, Response } from "express";
import { Schedule } from "../models/schedules";
import sequelize, { Op } from "sequelize";

// Controller do usuário
export const user = async (req: Request, res: Response) => {
    if(req.body.name && req.body.cpf && req.body.email && req.body.date) {
        let name:string = req.body.name;
        let cpf:string = req.body.cpf;
        let email:string = req.body.email;
        let date:string = req.body.date;
        
        let newSchedule = await Schedule.create({
            name, 
            cpf,
            email,
            date
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