import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import ProfileLib from "../libs/profileLib.mjs";

// Handle user-profile updates
export async function updateProfile(req, res) {
	const updatableFields = [
		'userName',
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
		
	try {
  	await ProfileLib.updateField(req.session.userId, fieldName, req.body.value)
  	return res.send({ result: true }) ;
	}
	catch(err) {
		if (err.code === MONGO_ERR_DUPLICATE_KEY) return res.status(409).send({message: `This ${fieldName} already exists`})
		else {
			console.error(err) ;
			return res.status(500).send({message: "Something went wrong!"})
		}
	}
}