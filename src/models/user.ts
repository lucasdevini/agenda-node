import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/sql';

export interface UserInstance extends Model {
    id: number,
    name: string,
    date: Date,
    email: string,
    phone: string,
    password: string,
    role: string
}

export const User = sequelize.define<UserInstance>('User',
{
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATE
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'user',
    timestamps: false
});