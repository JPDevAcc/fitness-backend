import { Schema, model } from 'mongoose';

const recipeSchema = Schema({
    title: String,
    id: Number,
    imageUrl: String,
})

export { recipeSchema };
export default () => model(global.userCollectionsPrefix + 'Recipe', recipeSchema) ;