import SocialLib from "../libs/socialLib.mjs";

// Create contact-request
export async function createContactRequest(req, res) {
	try {
  	await SocialLib.addContactRequest(req.session.userId, req.params.destUserName) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		if (err === "USER_NOT_FOUND") return res.status(404).send({message: "User not found"}) ;
		else if (err === "ALREADY_EXISTS") return res.status(409).send({message: "You have already sent this user a contact request"}) ;
		else if (err === "ALREADY_CONTACT") return res.status(409).send({message: "This user is already a contact"}) ;
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Accept contact-request
export async function acceptContactRequest(req, res) {
	try {
  	await SocialLib.acceptContactRequest(req.params.sourceUserName, req.session.userId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		if (err === "USER_NOT_FOUND") return res.status(404).send({message: "User not found"}) ;
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Reject contact-request
export async function rejectContactRequest(req, res) {
	try {
  	await SocialLib.removeContactRequest(req.params.sourceUserName, req.session.userId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Remove contact
export async function removeContact(req, res) {
	try {
  	await SocialLib.removeContact(req.params.contactUserName, req.session.userId) ;
		return res.send({ result: true }) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Retrieve contacts
export async function retrieveContacts(req, res) {
	try {
  	const contacts = await SocialLib.retrieveContacts(req.session.userId) ;
		return res.send(contacts) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}
