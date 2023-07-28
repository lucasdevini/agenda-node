import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/sql';

export interface escheduleInstance extends Model {
    id: number,
    email: string,
    user_id: number,
    date: Date,
    hour: string
}

export const Schedule = sequelize.define<escheduleInstance>('Schedule', {
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
        type: DataTypes.DATE
    },
    hour: {
        type: DataTypes.TIME
    }
}, {
    tableName: 'schedule',
    timestamps: false
})