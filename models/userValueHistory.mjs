import UserValueHistoryEntry from './subSchema/userData/userValueHistoryEntry.mjs';
import { Schema, model } from 'mongoose';

const userValueHistorySchema = Schema({
	historyValues: [UserValueHistoryEntry]
})

export default model('userValueHistory', userValueHistorySchema);