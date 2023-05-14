import { Schema, model } from 'mongoose';

const customWorkoutSchema = Schema({
    id: Number,
    title: String,
    sets: Number,
    exercises: [],
    date: Date,
    image: String,
    username: String,
})

export { customWorkoutSchema };
export default () => model(global.userCollectionsPrefix + 'CustomWorkout', customWorkoutSchema) ;