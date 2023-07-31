import { Request, Response } from "express";
import { Schedule } from "../models/schedules";
import sequelize, { Op } from "sequelize";
import { User, UserInstance } from "../models/user";

// Controller do usuário
export const userPage = async (req: Request, res: Response) => {
    const userEmail = (req.user as UserInstance).email

    res.render('pages/user', { userEmail });
}

export const scheduleForm = async (req: Request, res: Response) => {
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

    res.render('pages/scheduleForm');
} 

export const mySchedules = async (req: Request, res: Response) => {
    console.log(req.user);

    const user = await User.findOne({
        where: {
            id: (req.user as UserInstance).id,
            email: (req.user as UserInstance).email
        }
    })

    console.log(user);

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
    const id:number = req.body.id;
    const email:string = req.body.email;
    const status:string = req.body.status;

    console.log(req.body.id)

    if(status === 'accept') {
        const schedule = await Schedule.findOne({
            where: {
                id
            }
        });

        if(schedule) {
            schedule.status = status;
            await schedule.save();
        }
    } else {
        await Schedule.destroy({
            where: {
                id
            }
        });
    }

    return res.redirect('/pending-schedules');
}

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

   res.render('pages/search', {searchedDate, list});
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
 
    res.render('pages/search', {searchedDate, list});
 }