import { Schema, model } from 'mongoose';
import UserPrefs from './subSchema/userData/userPrefs.mjs';
import UserProfile from './subSchema/userData/userProfile.mjs';
import ContactRequest from './subSchema/userData/contactRequest.mjs';
import Contact from './subSchema/userData/contact.mjs';
import MessageMeta from './subSchema/userData/messageMeta.mjs';

const userDataSchema = Schema({
	userPrefs: UserPrefs,
	userProfile: UserProfile,
	contactRequests: [ContactRequest],
	contacts: [Contact],
	messageMetas: [MessageMeta],
	recipes: Array,
	customWorkouts: Array,
})

export { userDataSchema };
export default () => model(global.userCollectionsPrefix + 'UserData', userDataSchema) ;