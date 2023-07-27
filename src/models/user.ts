import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/sql';

export interface UserInstance extends Model {
    id: number,
    email: string,
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
    email: {
        type: DataTypes.STRING,
        unique: true,
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