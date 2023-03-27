import { Schema } from 'mongoose';

const userProfileSchema = Schema({
	userId: String,
	userName: { type: String, unique: true }, // Note: Might want to make this case-insensitive too by re-creating the collection with appropriate collation options
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
	imagePrivacy: String,
	selectedGoalIds: Array,
	selectedGoalIdsPrivacy: String
})

export default userProfileSchema ;