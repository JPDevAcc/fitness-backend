import { Schema, model } from 'mongoose';
import UserPrefs from './subSchema/userData/userPrefs.mjs';
import UserProfile from './subSchema/userData/userProfile.mjs';
import ContactRequest from './subSchema/userData/contactRequest.mjs';

const userDataSchema = Schema({
	userPrefs: UserPrefs,
	userProfile: UserProfile,
	contactRequests: [ContactRequest]
})

export default model('UserData', userDataSchema) ;