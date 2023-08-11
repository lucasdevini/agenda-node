import { Request, Response } from "express";
import { Schedule } from "../models/schedules";
import sequelize, { Op } from "sequelize";
import { User, UserInstance } from "../models/user";
import { validationResult } from "express-validator";

// Controller do usuário
export const userPage = (req: Request, res: Response) => {
    const userEmail = (req.user as UserInstance).email

    res.render('pages/user', { userEmail });
}

export const scheduleForm = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        const errorMessages = errors.array().map(error => error.msg);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errorMessages });
            return res.render('/schedule-form', { errors: errorMessages });
        }

        if ((req.user as UserInstance).email && (req.user as UserInstance).id) {
            const email: string = (req.user as UserInstance).email;
            const user_id: number = (req.user as UserInstance).id;
            const date: string = req.body.date;
            const hour: string = req.body.hour;

            await Schedule.create({
                email,
                user_id,
                date,
                hour
            })

            res.status(200).json({ message: 'Agendamento realizado com sucesso' });
            return res.redirect("/my-schedules");
        }
    } catch (err) {
        res.redirect('/schedule-form');
    }
}

export const scheduleFormPage = (req: Request, res: Response) => {
    res.render('pages/scheduleForm');
}

export const mySchedules = async (req: Request, res: Response) => {
    const user = await User.findOne({
        where: {
            id: (req.user as UserInstance).id,
            email: (req.user as UserInstance).email
        }
    })

    const id = user?.id;
    const email = user?.email;

    const schedules = await Schedule.findAll({
        where: {
            user_id: id,
            email: email
        }
    })

    res.render('pages/mySchedules', { schedules })
}

// Controllers do admin
export const adminPage = (req: Request, res: Response) => {
    res.render('pages/admin');
}

export const pendingSchedules = async (req: Request, res: Response) => {
    // Pega a data atual
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);

    // Pega todos agendamentos feitos na data atual
    const todayList = await Schedule.findAll({
        where: {
            date: {
                [Op.eq]: sequelize.literal(`DATE('${formattedDate}')`),
            }, 
            status: 'pending'
        }
    });

    // Agendamentos dos dias seguintes
    const list = await Schedule.findAll({
        where: {
            date: {
                [Op.gt]: sequelize.literal(`DATE('${formattedDate}')`)
            },
            status: 'pending'
        }
    });

    res.render('pages/pendingSchedules', {list, todayList, formattedDate});
}

export const confirmedSchedules = async (req: Request, res: Response) => {
    // Pega a data atual
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);

    // Pega todos agendamentos feitos na data atual
    const todayList = await Schedule.findAll({
        where: {
            date: {
                [Op.eq]: sequelize.literal(`DATE('${formattedDate}')`),
            },
            status: 'accept'
        }
    });

    // Agendamentos dos dias seguintes
    const list = await Schedule.findAll({
        where: {
            date: {
                [Op.gt]: sequelize.literal(`DATE('${formattedDate}')`)
            },
            status: 'accept'
        }
    });

    res.render('pages/confirmedschedules', {list, todayList, formattedDate});
}

export const acceptOrRefuseSchedule = async (req: Request, res: Response) => {
    try {
        const id: number = req.body.id;
        const status: string = req.body.status;

        if (status === 'accept') {
            const schedule = await Schedule.findOne({
                where: {
                    id
                }
            });

            if (schedule) {
                schedule.status = status;
                await schedule.save();
            }

            res.status(200).json({ message: 'Agendamento confirmado com sucesso' });
        } else {
            await Schedule.destroy({
                where: {
                    id
                }
            });

            res.status(200).json({ message: 'Agendamento recusado com sucesso' });
        }

        res.status(200).json({ message: 'Agendamento aceito/recusado com sucesso' });
    } catch (err) {
        res.status(500).json({
            error: 'Ocorreu um erro ao processar a ação. Por favor, tente novamente mais tarde.'
        });
    }
};

export const searchPending = async (req: Request, res: Response) => {
   let searchedDate: string = req.query.search as string;
   
   const list = await Schedule.findAll({
       where: {
           date: {
               [Op.eq]: sequelize.literal(`DATE('${searchedDate}')`)
           },
           status: 'pending' 
       } 
   }) 

   if(!searchedDate) {
       res.redirect('/admin');
       return;  
   }

   res.render('pages/searchPending', {searchedDate, list});
}

export const searchConfirmed = async (req: Request, res: Response) => {
    let searchedDate: string = req.query.search as string;
    
    const list = await Schedule.findAll({
        where: {
            date: {
                [Op.eq]: sequelize.literal(`DATE('${searchedDate}')`)
            },
            status: 'accept'
        } 
    }) 
 
    if(!searchedDate) {
        res.redirect('/admin');
        return;  
    }
 
    res.render('pages/searchConfirmed', {searchedDate, list});
}