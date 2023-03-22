import { Schema, model } from 'mongoose';

const recipeSchema = Schema({
    title: String,
    id: Number,
    imageUrl: String,
})

export default model('Recipe', recipeSchema);