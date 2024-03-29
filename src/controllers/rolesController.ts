import { Request, Response } from "express";
import { Schedule } from "../models/schedules";
import sequelize, { Op } from "sequelize";
import { User, UserInstance } from "../models/user";
import { validationResult } from "express-validator";

// Controllers do usuário
export const scheduleForm = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        const errorMessages = errors.array().map(error => error.msg);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errorMessages });
        }

        if ((req.user as UserInstance).email && (req.user as UserInstance).id) {
            const name: string = (req.user as UserInstance).name;
            const phone: string = (req.user as UserInstance).phone;
            const email: string = (req.user as UserInstance).email;
            const user_id: number = (req.user as UserInstance).id;
            const date: string = req.body.date;
            const hour: string = req.body.hour;

            const schedule = await Schedule.findOne({
                where: {
                    date,
                    hour
                }
            })

            if(schedule) {
                res.status(400).json({error: "Já existe um agendamento para esta mesma data nessa mesma hora!"});
            } else {
                await Schedule.create({
                    name,
                    phone,
                    email,
                    user_id,
                    date,
                    hour
                })

                res.status(200).json({success: "Agendamento realizado com sucesso!"});
            }
        }
    } catch (err) {
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.' });
    }
}

export const scheduleFormPage = async (req: Request, res: Response) => {
    const user = await User.findOne({
        where: {
            id: (req.user as UserInstance).id,
            email: (req.user as UserInstance).email
        }
    })
    
    const name = user?.name;

    res.render('pages/scheduleForm', { name, tittle: 'Realizar agendamento' });
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

    const name = user?.name;

    res.render('pages/mySchedules', { schedules, name, tittle: 'Meus agendamentos'  })
}

// Controllers do admin
export const pendingSchedules = async (req: Request, res: Response) => {
    // Pega a data atual
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);

    // Pega todos agendamentos feitos na data atual
    const todayList = await Schedule.findAll({
        where: {
            date: {
                [Op.eq]: today
            }, 
            status: 'pendente'
        }
    });

    // Agendamentos dos dias seguintes
    const list = await Schedule.findAll({
        where: {
            date: {
                [Op.gt]: today
            },
            status: 'pendente'
        }
    });

    res.render('pages/pendingSchedules', {list, todayList, formattedDate, tittle: 'Agendamentos pendentes' });
}

export const confirmedSchedules = async (req: Request, res: Response) => {
    // Pega a data atual
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);

    // Pega todos agendamentos feitos na data atual
    const todayList = await Schedule.findAll({
        where: {
            date: {
                [Op.eq]: today
            },
            status: 'confirmado'
        }
    });

    // Agendamentos dos dias seguintes
    const list = await Schedule.findAll({
        where: {
            date: {
                [Op.gt]: today
            },
            status: 'confirmado'
        }
    });

    res.render('pages/confirmedschedules', {list, todayList, formattedDate, tittle: 'Agendamentos confirmados'});
}

export const acceptOrRefuseSchedule = async (req: Request, res: Response) => {
    try {
        const id: number = req.body.id;
        const status: string = req.body.status;

        if (status === 'confirmado') { // aceita o agendamento
            const schedule = await Schedule.findOne({
                where: {
                    id
                }
            });

            if (schedule) {
                schedule.status = status;
                await schedule.save();
            }

            res.status(200).json({ accepted: 'Agendamento confirmado com sucesso' });
        } else { // recusa o agendamento e deleta seu registro
            await Schedule.destroy({
                where: {
                    id
                }
            });

            res.status(200).json({ refused: 'Agendamento recusado com sucesso' });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Ocorreu um erro ao processar a ação. Por favor, tente novamente mais tarde.'
        });
    }
};

export const searchPending = async (req: Request, res: Response) => {
   // busca os agendamentos pendentes
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

   res.render('pages/searchPending', {searchedDate, list, tittle: 'Agendamentos pendentes'});
}

export const searchConfirmed = async (req: Request, res: Response) => {
    // busca os agendamentos confirmados
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
 
    res.render('pages/searchConfirmed', {searchedDate, list, tittle: 'Agendamentos confirmados'});
}