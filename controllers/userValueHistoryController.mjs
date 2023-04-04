import UserValueHistory from "../models/userValueHistory.mjs";

// Handle user-profile updates
export async function getFirstValueForField(req, res) {
	const validFields = ['weight', 'height'] ;
	const fieldName = req.params.fieldName ;
	if (!validFields.includes(fieldName)) return res.status(400).send({message: "Invalid request"}) ;

	try {
  	const valueHistory = await UserValueHistory.findOne({_id: req.session.userId, [`historyValues.${fieldName}`] : {$exists: true}}).sort({ dateOnly: 1 })
		return res.send({ value: valueHistory.historyValues[0][fieldName] }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}
