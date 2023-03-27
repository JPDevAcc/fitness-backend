import { Schema } from 'mongoose';

const contactRequestSchema = Schema({
	sourceUserName: String, // REPLICATED FIELD! (should be synchronized with userProfile.userName)
	dateTime: Date,
	notificationState: {
		type: String,
    enum : ['pending', 'notified', 'dismissed'],
  	default: 'pending'
	}
})
export default contactRequestSchema ;