import UserPrefs from "../models/userPrefs.mjs";

export async function retrieve(req, res) {
	try {
		const _id = req.session.userId ;
		const userPrefs = await UserPrefs.findOne({ _id }) ;
		return res.send(userPrefs) ; // (not an error if it doesn't exist, we just return the null)
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Handle user-profile updates
export async function updatePrefs(req, res) {
	const updatableFields = ['onboardingStageComplete', 'weightUnits', 'heightUnits', 'distanceUnits', 'temperatureUnits'] ;
	const fieldName = req.params.fieldName ;
	if (!updatableFields.includes(fieldName)) return res.status(400).send({message: "Invalid request"}) ;

	const _id = req.session.userId ;
	const filter = { _id } ;
	const update = { $set: { [fieldName]: req.body.value } } ;
		
	try {
  	await UserPrefs.updateOne(filter, update, { upsert: true });
  	return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}