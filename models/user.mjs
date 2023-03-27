import { Schema, model } from 'mongoose';

const userSchema = Schema({
	email: { type: String, unique: true }, // Note: Probably want to make this case-insensitive too by re-creating the collection with appropriate collation options
	password: String,
	token: String // (not marked unique but negligible chance of collision)
})

export default model('User', userSchema);