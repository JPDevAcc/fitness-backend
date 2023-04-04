// Debugging method to get all database records

import User from "../models/user.mjs";
import UserData from "../models/userData.mjs";
import FileData from "../models/fileData.mjs";
import Message from "../models/message.mjs";
import UserValueHistory from '../models/userValueHistory.mjs';

export async function getAll(req, res) {
	try {
		const list = {User, UserData, Message, FileData, UserValueHistory} ;
		const data = {} ;
		for (const [schemaName, schema] of Object.entries(list)) {
			data[schemaName] = await schema.find() ;
		}

		// Remove the file data
		for (const key of Object.keys(data.FileData)) {
			data.FileData[key].dataBase64 = undefined ;
		}

    res.send(data) ;
	}
	catch(err) {
		console.error(err) ;
		res.status(500).send({message: "Something went wrong!"})
	}
}