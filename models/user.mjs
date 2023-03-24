import { Schema, model } from 'mongoose';

const userSchema = Schema({
	email: String,
	password: String,
	username: String,
	token: String
})

export default model('User', userSchema);