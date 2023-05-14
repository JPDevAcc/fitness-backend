import { Schema, model } from 'mongoose';

const commentSchema = Schema({
    username: String,
    profileImg: String,
    text: String,
    date: Date
})

export { commentSchema };
export default () => model(global.userCollectionsPrefix + 'Comment', commentSchema) ;