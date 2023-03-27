import SocialLib from "../libs/socialLib.mjs";

// Create contact-request
export async function createContactRequest(req, res) {
	try {
  	await SocialLib.addContactRequest(req.session.userId, req.params.destUserName) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		if (err === "NOT_FOUND") return res.status(404).send({message: "User not found"}) ;
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}