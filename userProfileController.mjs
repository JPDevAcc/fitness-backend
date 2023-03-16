import UserProfile from "./models/userProfile.mjs";

// Handle user-profile updates
export async function updateProfile(req, res) {
	const updatableFields = ['bio', 'age', 'weight', 'height', 'dietpractice', 'diettype'] ;
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