import User from "../models/user.mjs";

// Handle user registration
export async function userRegister(req, res) {
	const user = new User(req.body)
	try {
  	await user.save()
  	return res.send({ result: true }) ;
	}
	catch(err) {
		return res.status(500).send({message: "Something went wrong!"})
	}
}