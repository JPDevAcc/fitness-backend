import { Schema } from 'mongoose';

const contactSchema = Schema({
	userName: String, // REPLICATED FIELD! (should be synchronized with userProfile.userName)
	imageUrl: String, // REPLICATED FIELD! (should be synchronized with userProfile.imageUrl)
})

export default contactSchema ;