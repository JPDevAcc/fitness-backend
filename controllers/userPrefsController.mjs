import UserData from "../models/userData.mjs";
import * as v from "../utils/validation.mjs";

// Handle user-profile updates
export async function updatePrefs(req, res) {
	const fieldName = req.params.fieldName ;
	const value = req.body.value ;

	// Validation
	const weightUnits = ['kg', 'lbs', 'st. lbs'] ;
	const heightUnits = ['m', 'ft. in.'] ;
	const distanceUnits = ['km', 'miles'] ;
	const temperatureUnits = ['Celsius', 'Fahrenheit'] ;
	const updatableFields = ['onboardingStageComplete', 'weightUnits', 'heightUnits', 'distanceUnits', 'temperatureUnits'] ;
	if (!v.isStringOneOf(fieldName, updatableFields)) return res.status(400).send({message: "Bad request"}) ;
	if (fieldName === 'onboardingStageComplete' && !v.isBoolean(value)) return res.status(400).send({message: "Bad request"}) ;
	if (fieldName === 'weightUnits' && !v.isStringOneOf(value, weightUnits)) return res.status(400).send({message: "Bad request"}) ;
	if (fieldName === 'heightUnits' && !v.isStringOneOf(value, heightUnits)) return res.status(400).send({message: "Bad request"}) ;
	if (fieldName === 'distanceUnits' && !v.isStringOneOf(value, distanceUnits)) return res.status(400).send({message: "Bad request"}) ;
	if (fieldName === 'temperatureUnits' && !v.isStringOneOf(value, temperatureUnits)) return res.status(400).send({message: "Bad request"}) ;
	
	const _id = req.session.userId ;
	const filter = { _id } ;
	const update = { $set: { [`userPrefs.${fieldName}`]: value } } ;
		
	try {
  	await UserData.updateOne(filter, update); // (user profile should already exist at this point)
  	return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}