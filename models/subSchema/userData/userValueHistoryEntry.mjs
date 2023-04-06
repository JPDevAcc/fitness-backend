import { Schema } from 'mongoose';

const userValueHistoryEntrySchema = Schema({
	weight: Number,
	height: Number,
	dateOnly: String
}) ;

userValueHistoryEntrySchema.index({ dateOnly: 1 }, { unique: false });

export default userValueHistoryEntrySchema ;