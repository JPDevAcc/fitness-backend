import { Schema, model } from 'mongoose';

const post = Schema({
    title: String,
    description: String,
    imageUrl: String,
    comments: Array,
    likes: Number
})

export default model('Post', post);