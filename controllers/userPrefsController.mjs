import UserData from "../models/userData.mjs";

// Handle user-profile updates
export async function updatePrefs(req, res) {
	const updatableFields = ['onboardingStageComplete', 'weightUnits', 'heightUnits', 'distanceUnits', 'temperatureUnits'] ;
	const fieldName = req.params.fieldName ;
	if (!updatableFields.includes(fieldName)) return res.status(400).send({message: "Invalid request"}) ;

	const _id = req.session.userId ;
	const filter = { _id } ;
	const update = { $set: { [`userPrefs.${fieldName}`]: req.body.value } } ;
		
	try {
  	await UserData.updateOne(filter, update); // (user profile should already exist at this point)
  	return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}