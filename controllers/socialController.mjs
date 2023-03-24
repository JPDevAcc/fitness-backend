import SocialLib from "../libs/socialLib.mjs";

// Create contact-request
export async function createContactRequest(req, res) {
	try {
  	SocialLib.addContactRequestByUserIds(req.session.userId, req.params.destUserId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}