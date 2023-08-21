import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/sql';

export interface QuestionInstance extends Model {
    user_id: number,
    question: string,
    answer: string
}

export const Question = sequelize.define<QuestionInstance>('Questions',
{
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    question: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    answer: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'questions',
    timestamps: false
});