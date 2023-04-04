import { Schema } from 'mongoose';

const userValueHistoryEntrySchema = Schema({
	weight: Number,
	height: Number,
	dateOnly: String
}) ;

userValueHistoryEntrySchema.index({ dateTime: 1 }, { unique: true });

export default userValueHistoryEntrySchema ;