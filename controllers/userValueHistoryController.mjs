import getUserValueHistory from "../models/userValueHistory.mjs";
import * as v from "../utils/validation.mjs";

// Handle user-profile updates
export async function getFirstValueForField(req, res) {
	const UserValueHistory = getUserValueHistory() ;

	// Validation
	const fieldName = req.params.fieldName ;
	if (!v.isStringOneOf(fieldName, ['weight', 'height'])) return res.status(400).send({message: "Bad request"}) ;

	try {
  	const valueHistory = await UserValueHistory.findOne({_id: req.session.userId, [`historyValues.${fieldName}`] : {$exists: true}}).sort({ dateOnly: 1 })
		return res.send({ value: valueHistory?.historyValues[0][fieldName] }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}