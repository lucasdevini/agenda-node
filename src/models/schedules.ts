import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/sql';

export interface ScheduleInstance extends Model {
    id: number,
    email: string,
    user_id: number,
    date: Date,
    hour: string,
    status: string
}

export const Schedule = sequelize.define<ScheduleInstance>('Schedule', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.INTEGER,
        unique: true
    },
    date: {
        type: DataTypes.DATEONLY
    },
    hour: {
        type: DataTypes.TIME
    },
    status: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'schedule',
    timestamps: false
})