import { Schema, model } from 'mongoose';

const userProfileSchema = Schema({
	userId: String, // TOCHECK: Should this be a String or an ObjectID?
	onboardingStageComplete: Boolean,
  bio: String,
	age: String,
	weight: Number,
	height: Number,
	dietPractice: String,
	dietType: String,
})

export default model('UserProfile', userProfileSchema) ;