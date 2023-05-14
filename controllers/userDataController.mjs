import getUserDataModel from "../models/userData.mjs";

export async function retrieve(req, res) {
	const UserData = getUserDataModel() ;

	try {
		const _id = req.session.userId ;
		const userData = await UserData.findOne({ _id }) ;
		return res.send(userData) ; // (not an error if it doesn't exist, we just return the null)
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}