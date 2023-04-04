import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import FileDataLib from "../libs/fileDataLib.mjs";
import ProfileLib from "../libs/profileLib.mjs";
import * as v from "../utils/validation.mjs";

// Handle user-profile updates
export async function updateProfile(req, res) {
	const fieldName = req.params.fieldName ;
	const value = req.body.value ;

	// Validation (note: we could be more thorough here but should be sufficient to protect against DB injection)
	if (['bio', 'location', 'age', 'dietPractice', 'dietType', 'weightGoalUnits'].includes(fieldName)) {
		if (!v.isString(value)) return res.status(400).send({message: "Bad request"}) ;
	}
	else if (fieldName === 'onboardingStageComplete') {
		if (!v.isBoolean(value)) return res.status(400).send({message: "Bad request"}) ;
	}
	else if ([
		'onboardingStageComplete', 'bioPrivacy', 'locationPrivacy', 'agePrivacy', 'weightPrivacy',
		'heightPrivacy', 'dietPracticePrivacy', 'dietTypePrivacy', 'imagePrivacy', 'selectedGoalIdsPrivacy',
		'weightGoalPrivacy'
	].includes(fieldName)) {
		if (!v.isStringOneOf(value, ['pri', 'mem', 'pub'])) return res.status(400).send({message: "Bad request"}) ;
	}
	else if (['weight', 'height', 'weightGoalValue'].includes(fieldName)) {
		if (!v.isNumeric(value)) return res.status(400).send({message: "Bad request"}) ;
	}
	else if (fieldName === 'userName') {
		if (!v.isAsciiString(value, 8)) return res.status(400).send({message: "Bad request"}) ;
	}
	else if (fieldName === 'selectedGoalIds') {
		if (!v.isArrayOfStrings(value)) return res.status(400).send({message: "Bad request"}) ;
	}
	else return res.status(400).send({message: "Bad request"}) ; // (unknown field)

	try {
  	await ProfileLib.updateField(req.session.userId, fieldName, value)
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
	// Validation
	const category = req.params.category ;
	const dataBlob = req.body.dataBlob ;
	if (!v.isStringOneOf(category, ['profile'])) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isString(dataBlob)) return res.status(400).send({message: "Bad request"}) ;

	try {
		const fileName = await FileDataLib.createFileDataEntry(req.session.userId, category, dataBlob) ;
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
	// Validation
	const category = req.params.category ;
	if (!v.isStringOneOf(category, ['profile'])) return res.status(400).send({message: "Bad request"}) ;

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
	// Validation
	const currentPassword = req.body.currentPassword ;
	const newUserName = req.body.newUserName ;
	if (!v.isString(currentPassword, 8)) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isString(newUserName, 8)) return res.status(400).send({message: "Bad request"}) ;
	// (additional validation on username carried on by updateUserName())

	try {
		await ProfileLib.updateUserName(req.session.userId, currentPassword, req.body.newUserName) ;
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