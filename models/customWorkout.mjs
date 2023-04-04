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

export default model('CustomWorkout', customWorkoutSchema);