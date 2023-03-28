import { Schema } from 'mongoose';

const userPrefsSchema = Schema({
	onboardingStageComplete: Boolean,
	weightUnits: String,
	heightUnits: String,
	distanceUnits: String,
	temperatureUnits: String
})

export default userPrefsSchema ;