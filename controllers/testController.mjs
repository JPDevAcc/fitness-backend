// Debugging method to get all database records

import User from "../models/user.mjs";
import UserData from "../models/userData.mjs";

export async function getAll(req, res) {
	try {
		const list = {User, UserData} ;
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