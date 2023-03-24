import { Schema, model } from 'mongoose';

const notificationSchema = Schema({
	userId: String,
	sourceType: String,
	sourceCollectionId: String,
	isNewNotification: Boolean,
})

export default model('Notification', notificationSchema) ;