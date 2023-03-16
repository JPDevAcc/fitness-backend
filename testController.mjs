// Debugging method to get all database records

import User from "./models/user.mjs";
import UserProfile from "./models/userProfile.mjs";

export async function getAll(req, res) {
	try {
		const list = {User, UserProfile} ;
		const data = {} ;
		for (const [schemaName, schema] of Object.entries(list)) {
			data[schemaName] = await schema.find() ;
		}
    res.send(data) ;
	}
	catch(err) {
		console.error(err) ;
		res.status(500).send({message: "Something went wrong!"})
	}
}