import FileDataLib from "../libs/fileDataLib.mjs";
import * as v from "../utils/validation.mjs";

// Retrieve file
export async function getFile(req, res) {
	try {
		// Validation
		if (!v.isAsciiString(req.params.fileName)) return res.status(400).send({message: "Bad request"}) ;

		const dataBase64 = await FileDataLib.retrieveFileData(req.params.fileName) ;
		const buff = Buffer.from(dataBase64, 'base64');
		// TODO: Maybe set MIME type (and cache-control headers?)
		res.send(buff);
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}