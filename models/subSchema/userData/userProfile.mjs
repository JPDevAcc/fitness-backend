import { Schema } from 'mongoose';

const PrivacyType = { type: String, enum : ['pri', 'mem', 'pub'], default: 'pri' } ;

const userProfileSchema = Schema({
	userName: { type: String, unique: true }, // Note: Might want to make this case-insensitive too by re-creating the collection with appropriate collation options
	onboardingStageComplete: Boolean,
  bio: String,
	bioPrivacy: PrivacyType,
	location: String,
	locationPrivacy: PrivacyType,
	age: String,
	agePrivacy: PrivacyType,
	weight: Number,
	weightPrivacy: PrivacyType,
	height: Number,
	heightPrivacy: PrivacyType,
	dietPractice: String,
	dietPracticePrivacy: PrivacyType,
	dietType: String,
	dietTypePrivacy: PrivacyType,
	imageUrl: String,
	imageUrlPrivacy: PrivacyType,
	selectedGoalIds: Array,
	selectedGoalIdsPrivacy: PrivacyType,
	weightGoalValue: Number,
	weightGoalUnits: {
		type: String,
    enum : ['absolute', 'bmi', 'bmiPrime'],
	},
	weightGoalPrivacy: PrivacyType
})

export default userProfileSchema ;