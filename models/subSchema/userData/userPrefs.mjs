import { Schema } from 'mongoose';

const userPrefsSchema = Schema({
	userId: String,
	onboardingStageComplete: Boolean,
	weightUnits: String,
	heightUnits: String,
	distanceUnits: String,
	temperatureUnits: String
})

export default userPrefsSchema ;