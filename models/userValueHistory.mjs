import UserValueHistoryEntry from './subSchema/userData/userValueHistoryEntry.mjs';
import { Schema, model } from 'mongoose';

const userValueHistorySchema = Schema({
	historyValues: [UserValueHistoryEntry]
})

export { userValueHistorySchema };
export default () => model(global.userCollectionsPrefix + 'UserValueHistory', userValueHistorySchema) ;