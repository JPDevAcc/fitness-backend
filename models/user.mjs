import { Schema, model } from 'mongoose';

const userSchema = Schema({
	email: String,
	password: String,
	bio: String,
	imageUrl: String,
	token: String
})

export default model('User', userSchema);