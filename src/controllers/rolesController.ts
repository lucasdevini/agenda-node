import { Request, Response } from "express";
import { Schedule } from "../models/schedules";

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