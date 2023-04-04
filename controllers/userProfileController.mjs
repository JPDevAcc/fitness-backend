import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import { ensurePresent } from "../utils/utils.mjs";
import FileDataLib from "../libs/fileDataLib.mjs";
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
		'imagePrivacy',
		'selectedGoalIds', 'selectedGoalIdsPrivacy', /* TODO: Check contents of array as well */
		'weightGoalValue', 'weightGoalUnits', 'weightGoalPrivacy'
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

// Handle user-profile image update
export async function updateImage(req, res) {
	const validCategories = ['profile'] ;
	const category = req.params.category ;
	if (!validCategories.includes(category)) return res.status(400).send({message: "Invalid request"}) ;

	if (!ensurePresent(req.body, ['dataBlob'])) {
		res.status(400).send({message: "Bad request"})
		return ;
	}

	try {
		const fileName = await FileDataLib.createFileDataEntry(req.session.userId, category, req.body.dataBlob) ;
  	await ProfileLib.updateProfileImageUrl(req.session.userId, fileName) ;
  	return res.send({ url: fileName }) ;
	}
	catch(err) {
		if (err.code === MONGO_ERR_DUPLICATE_KEY) return res.status(409).send({message: `This ${fieldName} already exists`})
		else {
			console.error(err) ;
			return res.status(500).send({message: "Something went wrong!"})
		}
	}
}

// Handle user-profile image removal
export async function removeImage(req, res) {
	const validCategories = ['profile'] ;
	const category = req.params.category ;
	if (!validCategories.includes(category)) return res.status(400).send({message: "Invalid request"}) ;

	try {
		await FileDataLib.removeFileDataEntry(req.session.userId, category) ;
  	await ProfileLib.updateProfileImageUrl(req.session.userId, "") ;
  	return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Handle user-name change
export async function changeUserName(req, res) {
	if (!ensurePresent(req.body, ['currentPassword', 'newUserName'])) {
		return res.status(400).send({message: "Bad request"}) ;
	}

	try {
		await ProfileLib.updateUserName(req.session.userId, req.body.currentPassword, req.body.newUserName) ;
  	return res.send({ result: true }) ;
	}
	catch(err) {
		if (err === 'INVALID_USERNAME') return res.status(400).send({ message: 'Invalid username - must not start with "user"' }) ;
		else if (err === 'INVALID_USERNAME_LEN') return res.status(400).send({ message: 'Invalid username (must be at least 8 characters)' }) ;
		else if (err === 'INVALID_PASSWORD') return res.status(401).send({ message: 'Incorrect password' }) ;
		else if (err === 'ALREADY_CHANGED') return res.status(401).send({ message: 'Username has already been changed' }) ;
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}