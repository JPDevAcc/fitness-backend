import { Schema, model } from 'mongoose';

const messageSchema = Schema({
	destUserId: String,
	messageContent: String,
})

export default model('Message', messageSchema) ;