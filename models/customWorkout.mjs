import { Schema, model } from 'mongoose';

const customWorkoutSchema = Schema({
    title: String,
    sets: Number,
    exercises: [],
    date: Date,
    image: String
})

export default model('CustomWorkout', customWorkoutSchema);