import { Schema, model } from 'mongoose';

const recipeSchema = Schema({
    title: String,
    // ingredients_list: {},
    id: Number,
    imageUrl: String,
})

export default model('Recipe', recipeSchema);