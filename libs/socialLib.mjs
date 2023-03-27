import UserData from "../models/userData.mjs"

export default class SocialLib {
	static async addContactRequest(sourceUserId, destUserName) {
		// Source ID -> UserName
		const userDataSrc = await UserData.findOne({ _id: sourceUserId }) ;
		if (!userDataSrc) throw "NOT_FOUND" ; // (shouldn't happen except for race condition)
		const sourceUserName = userDataSrc.userProfile.userName ;

		// Dest UserName -> ID	
		const userDataDest = await UserData.findOne({ "userProfile.userName": destUserName }) ;
		if (!userDataDest) throw "NOT_FOUND" ;
		const destId = userDataDest._id ;

		// TODO: Check contact request doesn't already exist for this username/destination-id combination

		// Add contact request
		const contactRequestData = { sourceUserName, timestamp: new Date() } ;
		const filter = { _id: destId } ;
		const update = { $push: { contactRequests: contactRequestData }} ;
		await UserData.updateOne(filter, update);
	}
}