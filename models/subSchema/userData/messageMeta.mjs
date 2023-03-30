import { Schema } from 'mongoose';

const messageMetaSchema = Schema({
	sourceUserName: String, // REPLICATED FIELD! (should be synchronized with userProfile.userName)
	sourceImageUrl: String, // REPLICATED FIELD! (should be synchronized with userProfile.imageUrl)
	messageSubject: String,
	messageSummary: String,
	dateTime: { type: Date, default: () => Date.now() }
})

export default messageMetaSchema ;