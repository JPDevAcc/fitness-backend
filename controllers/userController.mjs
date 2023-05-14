import getUserModel  from "../models/user.mjs";
import bcrypt from "bcryptjs";
import * as v from "../utils/validation.mjs";

// Handle user registration
export async function userRegister(req, res) {
	const User = getUserModel() ;

	// Validation
	if (!v.isEmail(req.body.email)) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isString(req.body.password, 8)) return res.status(400).send({message: "Bad request"}) ;

	const user = new User({email: req.body.email, password: req.body.password}) ;
	try {
		user.password = bcrypt.hashSync(user.password, 8);

  	await user.save()
  	return res.send({ result: true }) ;
	}
	catch(err) {
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Handle password change
export async function userChangePwd(req, res) {
	const User = getUserModel() ;

	// Validation
	if (!v.isString(req.body.currentPwd, 8)) return res.status(400).send({message: "Bad request"}) ;
	if (!v.isString(req.body.newPwd, 8)) return res.status(400).send({message: "Bad request"}) ;

	try {
		// Get user
		const _id = req.session.userId ;
		const user = await User.findOne({ _id }) ;
		if (!user) res.status(404).send({ message: "Not found" }) ; // (shouldn't happen except for possible race condition)

		// Check current password matches
		if (!bcrypt.compareSync(req.body.currentPwd, user.password)) {
			return res.status(401).send({ message: 'Incorrect password' });
		}

		// Update password
		user.password = bcrypt.hashSync(req.body.newPwd, 8);
  	await user.save()
		
		// Okay
  	return res.send({ result: true }) ;
	}
	catch(err) {
		return res.status(500).send({message: "Something went wrong!"})
	}
}

// Handle account deletion
export async function userDeleteAccount(req, res) {
	const User = getUserModel() ;
	
	// Validation
	if (!v.isString(req.body.currentPwd, 8)) return res.status(400).send({message: "Bad request"}) ;

	try {
		// Get user
		const _id = req.session.userId ;
		const user = await User.findOne({ _id }) ;
		if (!user) return res.status(404).send({ message: "Not found" }) ; // (shouldn't happen except for possible race condition)

		// Check current password matches
		if (!bcrypt.compareSync(req.body.currentPwd, user.password)) {
			return res.status(401).send({ message: 'Incorrect password' });
		}

		// Delete account || TODO: Delete all other associated data!
		await User.deleteOne({ _id }) ;
		
		// Okay
  	return res.send({ result: true }) ;
	}
	catch(err) {
		return res.status(500).send({message: "Something went wrong!"})
	}
}