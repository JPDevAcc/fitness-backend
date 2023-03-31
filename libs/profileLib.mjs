import { nonCryptoRandHexString } from "../utils/utils.mjs";
import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import User from "../models/user.mjs";
import UserData from "../models/userData.mjs";
import Post from "../models/post.mjs";
import Comment from "../models/comment.mjs";

import bcrypt from "bcryptjs";

export default class ProfileLib {
	// Set a random username (on first login)
	static async setInitialRandomUserName(userId) {
		while (true) {
			// Generate random username | 8 * 4 = 32 bits = 16 bits collision resistance
			// (should be okay until we have 100K+ users who don't bother changing their username)
			const userName = "User_" + nonCryptoRandHexString(8) ;
			const userData = new UserData({ _id: userId, "userProfile.userName": userName }) ;
			console.log("Trying new UserData ", userData) ;

			try {
				await userData.save() ;
			}
			catch(err) {
				if (err.code !== MONGO_ERR_DUPLICATE_KEY) throw (err) ; // Unknown error
				else {
					const dupField = Object.keys(err.keyValue)[0];
					if (dupField === '_id') return ; // (already exists so we don't need to create it)
				}
				// (otherwise it was a duplicate username so we go around the loop and try another one)
			}
		} ;
	}

	static async updateField(userId, fieldName, value) {
		const filter = { _id: userId } ;
		const update = { $set: { [`userProfile.${fieldName}`]: value } } ;
		await UserData.updateOne(filter, update); // (user profile should already exist at this point)
	}

	static async updateProfileImageUrl(userId, newImageUrl) {
		// Get userData and old image url
		const userData = await UserData.findOne({ _id: userId }) ;
		if (!userData) throw "SELF_NOT_FOUND"; // (shouldn't happen except for possible race condition)
		const oldImageUrl = userData.userProfile.imageUrl ;

		// TODO: Wrap in transaction?

		// Update profile image-url in user-data
		userData.userProfile.imageUrl = newImageUrl ;
		await userData.save()

		// - Update other occurrences -
		const updateDefs = [
			{
				model: UserData,
				filter: {"contactRequests.sourceImageUrl": oldImageUrl},
				update: {$set: {"contactRequests.$[].sourceImageUrl": newImageUrl}},
				arrayFilter: {"contactRequests.sourceImageUrl": oldImageUrl}
			},
			{
				model: UserData,
				filter: {"contacts.imageUrl": oldImageUrl},
				update: {$set: {"contacts.$[].imageUrl": newImageUrl}},
				arrayFilter: {"contacts.imageUrl": oldImageUrl}
			},
			{
				model: UserData,
				filter: {"messageMetas.sourceImageUrl": oldImageUrl},
				update: {$set: {"messageMetas.$[].sourceImageUrl": newImageUrl}},
				arrayFilter: {"messageMetas.sourceImageUrl": oldImageUrl}
			},
			{
				model: Post,
				filter: {"profileImg": oldImageUrl},
				update: {$set: {"profileImg": newImageUrl}}
			},
			{
				model: Comment,
				filter: {"profileImg": oldImageUrl},
				update: {$set: {"profileImg": newImageUrl}}
			}
		] ;

		for (const {model, filter, update, arrayFilter} of updateDefs) {
			if (arrayFilter) await model.updateMany(filter, update, {arrayFilter}) ;
			else await model.updateMany(filter, update, {arrayFilter}) ;
		}
	}

	static async updateUserName(userId, currentPwd, newUserName) {
		// Get user
		const user = await User.findOne({ _id: userId }) ;
		if (!user) throw "SELF_NOT_FOUND"; // (shouldn't happen except for possible race condition)

		// Check username is valid (we don't allow ones that look like the random ones and we enforce a min length)
		if (newUserName.substring(0, 4).toLowerCase() === 'user') throw "INVALID_USERNAME" ;
		if (newUserName.length < 8) throw "INVALID_USERNAME_LEN" ;

		// Check current password matches
		if (!bcrypt.compareSync(currentPwd, user.password)) throw "INVALID_PASSWORD" ;

		// Get userData and old username
		const userData = await UserData.findOne({ _id: userId }) ;
		if (!userData) throw "SELF_NOT_FOUND"; // (shouldn't happen except for possible race condition)
		const oldUserName = userData.userProfile.userName ;

		// Check user is changing away from the automatically allocated random username
		// (this restriction is subject to change)
		if (oldUserName.substring(0, 4).toLowerCase() !== 'user') {
			throw "ALREADY_CHANGED" ;
		}

		// TODO: Wrap in transaction?

		// Update username in user-data
		userData.userProfile.userName = newUserName ;
		await userData.save()

		// - Update other occurrences -
		const updateDefs = [
			{
				model: UserData,
				filter: {"contactRequests.sourceUserName": oldUserName},
				update: {$set: {"contactRequests.$[].sourceUserName": newUserName}},
				arrayFilter: {"contactRequests.sourceUserName": oldUserName}
			},
			{
				model: UserData,
				filter: {"contacts.userName": oldUserName},
				update: {$set: {"contacts.$[].userName": newUserName}},
				arrayFilter: {"contacts.userName": oldUserName}
			},
			{
				model: UserData,
				filter: {"messageMetas.sourceUserName": oldUserName},
				update: {$set: {"messageMetas.$[].sourceUserName": newUserName}},
				arrayFilter: {"messageMetas.sourceUserName": oldUserName}
			},
			{
				model: Post,
				filter: {"username": oldUserName},
				update: {$set: {"username": newUserName}}
			},
			{
				model: Comment,
				filter: {"username": oldUserName},
				update: {$set: {"username": newUserName}}
			}
		] ;

		for (const {model, filter, update, arrayFilter} of updateDefs) {
			if (arrayFilter) await model.updateMany(filter, update, {arrayFilter}) ;
			else await model.updateMany(filter, update, {arrayFilter}) ;
		}
	}
}