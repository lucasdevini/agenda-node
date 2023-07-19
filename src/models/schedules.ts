import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/sql';

export interface escheduleInstance extends Model {
    id: number,
    name: string, 
    cpf: string,  
    email: string,
    date: Date
}

export const Schedule = sequelize.define<escheduleInstance>('Schedule', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    cpf: {
        type: DataTypes.INTEGER,
        unique: true
    },
    email: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'schedules',
    timestamps: false
})