import { Schema, model } from 'mongoose';

const post = Schema({
    username: String,
    profileImg: String,
    title: String,
    description: String,
    imageUrl: String,
    date: Date,
    comments: Array,
    likes: Array,
    lols: Array,
})

export default model('Post', post);