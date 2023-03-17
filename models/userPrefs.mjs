import { Schema, model } from 'mongoose';

const userPrefsSchema = Schema({
	userId: String, // TOCHECK: Should this be a String or an ObjectID?
	onboardingStageComplete: Boolean,
	weightUnits: String,
	heightUnits: String,
	distanceUnits: String,
	temperatureUnits: String
})

export default model('UserPrefs', userPrefsSchema) ;