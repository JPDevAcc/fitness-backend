import { Schema, model } from 'mongoose';

const messageSchema = Schema({
	destUserId: String,
	messageContent: String,
})

export { messageSchema };
export default () => model(global.userCollectionsPrefix + 'Message', messageSchema) ;