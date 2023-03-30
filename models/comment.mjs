import { Schema, model } from 'mongoose';

const commentSchema = Schema({
    username: String,
    profileImg: String,
    text: String,
    date: Date
})

export default model('Comment', commentSchema);
