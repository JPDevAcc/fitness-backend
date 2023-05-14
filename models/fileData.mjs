import { Schema, model } from 'mongoose';

const fileDataSchema = Schema({
	foreignId: String, // ID of object that this file is linked to (e.g. userId)
	fileName: String,
	category: {
		type: String,
    enum : ['profile']
	},
	dataBase64: String
})

fileDataSchema.index({ foreignId: 1, fileName: 1, category: 1}, { unique: true });

export { fileDataSchema };
export default () => model(global.userCollectionsPrefix + 'FileData', fileDataSchema) ;