import UserData from "../models/userData.mjs"

export default class SocialLib {
	static async addContactRequest(sourceUserId, destUserName) {
		// Source ID -> UserName
		const userDataSrc = await UserData.findOne({ _id: sourceUserId }) ;
		if (!userDataSrc) throw "NOT_FOUND" ; // (shouldn't happen except for race condition)
		const sourceUserName = userDataSrc.userProfile.userName ;
		const sourceImageUrl = userDataSrc.userProfile.imageUrl ;

		// Dest UserName -> ID	
		const userDataDest = await UserData.findOne({ "userProfile.userName": destUserName }) ;
		if (!userDataDest) throw "NOT_FOUND" ;
		const destUserId = userDataDest._id ;

		// Check contact request doesn't already exist from this username
		const contactRequestExisting = await UserData.findOne({ _id: destUserId, "contactRequests.sourceUserName": sourceUserName }) ;
		if (contactRequestExisting) throw "ALREADY_EXISTS" ;

		// Add contact request
		const contactRequestData = { sourceUserName, sourceImageUrl, timestamp: new Date() } ;
		const filter = { _id: destUserId } ;
		const update = { $push: { contactRequests: contactRequestData }} ;
		await UserData.updateOne(filter, update);
	}

	static async removeContactRequest(sourceUserName, destUserId) {
		await UserData.deleteOne({"contactRequests.sourceUserName": sourceUserName, _id: destUserId}) ; // Fail silently if it doesn't exist
	}
}