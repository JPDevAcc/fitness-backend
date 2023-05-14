import { Schema, model } from 'mongoose';

const pictureSchema = Schema({
    title: String,
    description: String,
    imageUrl: String,
})

export { pictureSchema };
export default () => model(global.userCollectionsPrefix + 'Picture', pictureSchema) ;