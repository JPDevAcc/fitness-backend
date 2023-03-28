import User from "../models/user.mjs";
import bcrypt from "bcryptjs";
import { ensurePresent } from "../utils/utils.mjs";

// Handle user registration
export async function userRegister(req, res) {
	const userData = req.body ;
	userData.username = userData.email ; // (just use e-mail address for username for now)
	const user = new User(req.body)
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
	if (!ensurePresent(req.body, ['currentPwd', 'newPwd'])) {
		res.status(400).send({message: "Bad request"})
		return ;
	}

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
	if (!ensurePresent(req.body, ['currentPwd'])) {
		res.status(400).send({message: "Bad request"})
		return ;
	}

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