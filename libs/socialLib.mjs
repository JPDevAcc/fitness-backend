import UserData from "../models/userData.mjs"

export default class SocialLib {
	static async addContactRequest(sourceUserId, destUserName) {
		// Source ID -> UserName
		const userDataSrc = await UserData.findOne({ _id: sourceUserId }) ;
		if (!userDataSrc) throw "SELF_NOT_FOUND" ; // (shouldn't happen except for race condition)
		const sourceUserName = userDataSrc.userProfile.userName ;
		const sourceImageUrl = userDataSrc.userProfile.imageUrl ;

		// Dest UserName -> ID	
		const userDataDest = await UserData.findOne({ "userProfile.userName": destUserName }) ;
		if (!userDataDest) throw "USER_NOT_FOUND" ;
		const destUserId = userDataDest._id ;

		// Check contact request doesn't already exist from this username
		const contactRequestExisting = await UserData.findOne({ _id: destUserId, "contactRequests.sourceUserName": sourceUserName }) ;
		if (contactRequestExisting) throw "ALREADY_EXISTS" ;

		// Check user isn't already a contact
		const contactData = await UserData.findOne({ "contacts.userName": sourceUserName }) ;
		if (contactData) throw "ALREADY_CONTACT" ;

		// Add contact request
		const contactRequestData = { sourceUserName, sourceImageUrl, timestamp: new Date() } ;
		const filter = { _id: destUserId } ;
		const update = { $push: { contactRequests: contactRequestData }} ;
		await UserData.updateOne(filter, update);
	}

	static async acceptContactRequest(sourceUserName, destUserId) {
		await this.addContact(sourceUserName, destUserId) ;
		await this.removeContactRequest(sourceUserName, destUserId) ;
	}

	static async removeContactRequest(sourceUserName, destUserId) {
		const filter = { _id: destUserId } ;
		const update = { $pull: { "contactRequests": { sourceUserName }}} ;
		await UserData.updateOne(filter, update) ; // Fail silently if it doesn't exist
	}

	static async addContact(sourceUserName, destUserId) {
		// Check contact-to-be-added exists (source) and get id and image url
		const userDataSrc = await UserData.findOne({ "userProfile.userName": sourceUserName }) ;
		if (!userDataSrc) throw "USER_NOT_FOUND" ;
		const sourceUserId = userDataSrc._id ;
		const sourceImageUrl = userDataSrc.userProfile.imageUrl ;

		// Get username and image url for current user (dest)
		const userDataDest = await UserData.findOne({ _id: destUserId }) ;
		if (!userDataDest) throw "SELF_NOT_FOUND" ; // (shouldn't happen except for race condition)
		const destUserName = userDataDest.userProfile.userName ;
		const destImageUrl = userDataDest.userProfile.imageUrl ;

		// Add for source
		{
			const contactData = { userName: destUserName, imageUrl: destImageUrl } ;
			const filter = { _id: sourceUserId } ;
			const update = { $push: { contacts: contactData }} ;
			await UserData.updateOne(filter, update);
		}

		// Add for dest
		{
			const contactData = { userName: sourceUserName, imageUrl: sourceImageUrl } ;
			const filter = { _id: destUserId } ;
			const update = { $push: { contacts: contactData }} ;
			await UserData.updateOne(filter, update);
		}
	}
}