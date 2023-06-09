import { Schema } from 'mongoose';

const contactRequestSchema = Schema({
	sourceUserName: String, // REPLICATED FIELD! (should be synchronized with userProfile.userName)
	sourceImageUrl: String, // REPLICATED FIELD! (should be synchronized with userProfile.imageUrl)
	dateTime: { type: Date, default: () => Date.now() },
	notificationState: {
		type: String,
    enum : ['pending', 'notified'],
  	default: 'pending'
	}
})

export default contactRequestSchema ;