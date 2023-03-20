import { Schema, model } from 'mongoose';

const userProfileSchema = Schema({
	userId: String, // TOCHECK: Should this be a String or an ObjectID?
	onboardingStageComplete: Boolean,
  bio: String,
	bioPrivacy: String,
	age: String,
	agePrivacy: String,
	weight: Number,
	weightPrivacy: String,
	height: Number,
	heightPrivacy: String,
	dietPractice: String,
	dietPracticePrivacy: String,
	dietType: String,
	dietTypePrivacy: String,
	image: String,
	imagePrivacy: String
})

export default model('UserProfile', userProfileSchema) ;