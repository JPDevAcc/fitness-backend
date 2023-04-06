import { nonCryptoRandHexString } from "../utils/utils.mjs";
import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import User from "../models/user.mjs";
import UserData from "../models/userData.mjs";
import Post from "../models/post.mjs";
import Comment from "../models/comment.mjs";
import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';
import UserValueHistoryLib from "./userValueHistoryLib.mjs";

export default class ProfileLib {
	// Retrieve profile-data according to privacy settings
	static async retrieveProfile(currentUserId, userName) {
		const userData = await UserData.findOne({ "userProfile.userName": userName });
		if (!userData) throw "USER_NOT_FOUND" ;
		const userProfile = userData.userProfile.toObject() ;

		// Determine access-level of current user
		let accessLevel ;
		if (!currentUserId) accessLevel = 0 ; // (public-only)
		else if (currentUserId !== userData._id.toString()) accessLevel = 1 // (members-only)
		else accessLevel = 2 ; // (private)

		// Lookup table for access levels
		const privacySettingToLevel = {
			'pub' : 0,
			'mem' : 1,
			'pri' : 2
		} ;

		console.log("ACCESS:", currentUserId, userData._id.toString(), accessLevel) ;
		console.log(userProfile) ;
		
		// Build censored profile-data object
		// (username is already known, but included here for ease-of-access)
		const userProfileCensored = {userName: userProfile.userName} ;
		// (special handling for weight goal as it's split into two different fields)
		const weightGoalPrivacyLevel = privacySettingToLevel[userProfile.weightGoalPrivacy] ;
		if (accessLevel >= weightGoalPrivacyLevel) {
			userProfileCensored.weightGoalValue = userProfile.weightGoalValue ;
			userProfileCensored.weightGoalUnits = userProfile.weightGoalUnits ;
		}
		// (other fields the current user has access to and all the privacy settings)
		for (const [fieldName, value] of Object.entries(userProfile)) {
			console.log(fieldName, /Privacy$/.test(fieldName), userProfile[fieldName + 'Privacy']) ;
			if (/Privacy$/.test(fieldName)) userProfileCensored[fieldName] = value ; // (include the privacy settings themselves)
			else {
				const privacySetting = userProfile[fieldName + 'Privacy'] ;
				if (privacySetting) {
					const privacyLevel = privacySettingToLevel[privacySetting] ;
					if (accessLevel >= privacyLevel) userProfileCensored[fieldName] = value ; // (include the field if current user has sufficient access)
				}
			}
		}

		return userProfileCensored ;
	}

	// Set (on first login) a (random) unique username and unique image url (denoting no image)
	static async initialProfileSetup(userId) {
		const imageUrl = 'none_' + randomBytes(32).toString('hex') ;
		while (true) {
			// Generate random username | 8 * 4 = 32 bits = 16 bits collision resistance
			// (should be okay until we have 100K+ users who don't bother changing their username)
			const userName = "User_" + nonCryptoRandHexString(8) ;
			const userData = new UserData({
				_id: userId,
				"userProfile.userName": userName,
				"userProfile.imageUrl": imageUrl
			}) ;
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

		// Update weight / height history if one of those fields was modified
		if (fieldName === 'weight' || fieldName === 'height') {
			await UserValueHistoryLib.setFieldForCurrentDay(userId, fieldName, value) ;
		}
	}

	static async updateProfileImageUrl(userId, newImageUrl) {
		// Generate a unique url denoting no-image if removing the image (so we can still do find-and-replace on them in the future) 
		if (newImageUrl === "") newImageUrl = 'none_' + randomBytes(32).toString('hex') ;

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
				update: {$set: {"contactRequests.$[elem].sourceImageUrl": newImageUrl}},
				arrayFilters: [{"elem.sourceImageUrl": oldImageUrl}]
			},
			{
				model: UserData,
				filter: {"contacts.imageUrl": oldImageUrl},
				update: {$set: {"contacts.$[elem].imageUrl": newImageUrl}},
				arrayFilters: [{"elem.imageUrl": oldImageUrl}]
			},
			{
				model: UserData,
				filter: {"messageMetas.sourceImageUrl": oldImageUrl},
				update: {$set: {"messageMetas.$[elem].sourceImageUrl": newImageUrl}},
				arrayFilters: [{"elem.sourceImageUrl": oldImageUrl}]
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

		for (const {model, filter, update, arrayFilters} of updateDefs) {
			if (arrayFilters) await model.updateMany(filter, update, {arrayFilters}) ;
			else await model.updateMany(filter, update) ;
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
				update: {$set: {"contactRequests.$[elem].sourceUserName": newUserName}},
				arrayFilters: [{"elem.sourceUserName": oldUserName}]
			},
			{
				model: UserData,
				filter: {"contacts.userName": oldUserName},
				update: {$set: {"contacts.$[elem].userName": newUserName}},
				arrayFilters: [{"elem.userName": oldUserName}]
			},
			{
				model: UserData,
				filter: {"messageMetas.sourceUserName": oldUserName},
				update: {$set: {"messageMetas.$[elem].sourceUserName": newUserName}},
				arrayFilters: [{"elem.sourceUserName": oldUserName}]
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

		for (const {model, filter, update, arrayFilters} of updateDefs) {
			if (arrayFilters) await model.updateMany(filter, update, {arrayFilters}) ;
			else await model.updateMany(filter, update) ;
		}
	}
}