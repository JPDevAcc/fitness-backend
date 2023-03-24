import { Schema, model } from 'mongoose';

const contactRequestSchema = Schema({
	sourceUserId: String,
	destUserId: String,
	timestamp: Date
})

export default model('ContactRequest', contactRequestSchema) ;