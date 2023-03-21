import UserProfile from "../models/userProfile.mjs";

export async function retrieve(req, res) {
	try {
		const _id = req.session.userId ;
		const userProfile = await UserProfile.findOne({ _id }) ;
		return res.send(userProfile) ; // (not an error if it doesn't exist, we just return the null)
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Handle user-profile updates
export async function updateProfile(req, res) {
	const updatableFields = [
		'onboardingStageComplete',
		'bio', 'bioPrivacy',
		'age', 'agePrivacy',
		'weight', 'weightPrivacy',
		'height', 'heightPrivacy',
		'dietPractice', 'dietPracticePrivacy',
		'dietType', 'dietTypePrivacy',
		'image', 'imagePrivacy',
		'selectedGoalIds', 'selectedGoalIdsPrivacy' /* TODO: Check contents of array as well */
	] ;
	const fieldName = req.params.fieldName ;
	if (!updatableFields.includes(fieldName)) return res.status(400).send({message: "Invalid request"}) ;

	const _id = req.session.userId ;
	const filter = { _id } ;
	const update = { $set: { [fieldName]: req.body.value } } ;
		
	try {
  	await UserProfile.updateOne(filter, update, { upsert: true });
  	return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}