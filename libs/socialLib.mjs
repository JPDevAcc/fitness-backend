import getUserDataModel from "../models/userData.mjs"
import getMessageModel from "../models/message.mjs";
import { trimWithEllipsis } from "../utils/utils.mjs";
import mongoose from "mongoose";

export default class SocialLib {
	static async addContactRequest(sourceUserId, destUserName) {
		const UserData = getUserDataModel() ;

		// Source ID -> UserName, Image URL
		const userDataSrc = await UserData.findOne({ _id: sourceUserId }) ;
		if (!userDataSrc) throw "SELF_NOT_FOUND" ; // (shouldn't happen except for race condition)
		const sourceUserName = userDataSrc.userProfile.userName ;
		const sourceImageUrl = userDataSrc.userProfile.imageUrl ;

		// Dest UserName -> ID	
		const userDataDest = await UserData.findOne({ "userProfile.userName": destUserName }) ;
		if (!userDataDest) throw "USER_NOT_FOUND" ;
		const destUserId = userDataDest._id ;

		// Check source and destination users are different
		if (sourceUserId === destUserId.toString()) throw "SAME_USER" ;

		// Check contact request doesn't already exist from this username
		const contactRequestExisting = await UserData.findOne({ _id: destUserId, "contactRequests.sourceUserName": sourceUserName }) ;
		if (contactRequestExisting) throw "ALREADY_EXISTS" ;

		// Check user isn't already a contact
		const contactData = await UserData.findOne({ _id: sourceUserId, "contacts.userName": destUserName }) ;
		if (contactData) throw "ALREADY_CONTACT" ;

		// Add contact request
		const contactRequestData = { sourceUserName, sourceImageUrl } ;
		const filter = { _id: destUserId } ;
		const update = { $push: { contactRequests: contactRequestData }} ;
		await UserData.updateOne(filter, update);
	}

	static async acceptContactRequest(sourceUserName, destUserId) {
		await this.addContact(sourceUserName, destUserId) ;
		await this.removeContactRequest(sourceUserName, destUserId) ;
	}

	static async removeContactRequest(sourceUserName, destUserId) {
		const UserData = getUserDataModel() ;

		const filter = { _id: destUserId } ;
		const update = { $pull: { "contactRequests": { sourceUserName }}} ;
		await UserData.updateOne(filter, update) ; // Fail silently if it doesn't exist
	}

	static async addContact(sourceUserName, destUserId) {
		const UserData = getUserDataModel() ;

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

		// Check contact-request exists
		if (!userDataDest.contactRequests.map(contactReq => contactReq.sourceUserName).includes(sourceUserName)) {
			throw "NO_CONTACT_REQUEST" ;
		}

		// Check user isn't already a contact
		const contactData = await UserData.findOne({ _id: sourceUserId, "contacts.userName": destUserName }) ;
		if (contactData) throw "ALREADY_CONTACT" ;

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

	static async removeContact(contactUserName, currentUserId) {
		const UserData = getUserDataModel() ;

		// Get username for current user
		const userDataCurrent = await UserData.findOne({ _id: currentUserId }) ;
		if (!userDataCurrent) throw "SELF_NOT_FOUND" ; // (shouldn't happen except for race condition)
		const currentUserName = userDataCurrent.userProfile.userName ;

		// Remove for contact
		{
			const filter = { "userProfile.userName": contactUserName } ;
			const update = { $pull: { "contacts": { userName: currentUserName }}} ;
			await UserData.updateOne(filter, update) ; // Fail silently if it doesn't exist
		}

		// Remove for self
		{
			const filter = { _id: currentUserId } ;
			const update = { $pull: { "contacts": { userName: contactUserName }}} ;
			await UserData.updateOne(filter, update) ; // Fail silently if it doesn't exist
		}		
	}

	static async retrieveContacts(userId) {
		const UserData = getUserDataModel() ;

		const userData = await UserData.findOne({ _id: userId }) ;
		if (!userData) throw "SELF_NOT_FOUND" ; // (shouldn't happen except for race condition)
		return userData.contacts ;
	}

	static async createMessage(sourceUserId, destUserName, messageSubject, messageContent) {
		const UserData = getUserDataModel() ;
		const Message = getMessageModel() ;

		// Source ID -> UserName, Image URL
		const userDataSrc = await UserData.findOne({ _id: sourceUserId }) ;
		if (!userDataSrc) throw "SELF_NOT_FOUND" ; // (shouldn't happen except for race condition)
		const sourceUserName = userDataSrc.userProfile.userName ;
		const sourceImageUrl = userDataSrc.userProfile.imageUrl ;

		// Check message recipient is a contact
		if (!userDataSrc.contacts.map(contact => contact.userName).includes(destUserName)) {
			throw "NOT_CONTACT" ;
		}

		// Dest UserName -> ID
		const userDataDest = await UserData.findOne({ "userProfile.userName": destUserName }) ;
		if (!userDataDest) throw "USER_NOT_FOUND" ;
		const destUserId = userDataDest._id ;

		const messageSummary = trimWithEllipsis(messageContent, 64) ;

		// Add message metadata
		const _id = new mongoose.Types.ObjectId() ;
		const messageMetaData = { _id, sourceUserName, sourceImageUrl, messageSubject, messageSummary } ;
		const filter = { _id: destUserId } ;
		const update = { $push: { messageMetas: messageMetaData }} ;
		await UserData.updateOne(filter, update) ;
		
		// Add message itself
		const message = new Message({_id, destUserId, messageContent}) ;
		await message.save() ;
	}

	static async retrieveMessageMetas(userId) {
		const UserData = getUserDataModel() ;

		const userData = await UserData.findOne({ _id: userId }) ;
		if (!userData) throw "SELF_NOT_FOUND" ; // (shouldn't happen except for race condition)
		return userData.messageMetas ;
	}

	static async removeMessage(currentUserId, messageId) {
		const UserData = getUserDataModel() ;
		const Message = getMessageModel() ;

		// Remove message metadata
		{
			const filter = { _id: currentUserId } ; // (match user)
			const update = { $pull: { "messageMetas": { _id: messageId }}} ; // (implicitly match message id)
			await UserData.updateOne(filter, update) ;
		}
		
		// Remove message itself
		{
			const filter = { destUserId: currentUserId, _id: messageId } ; // (match user and message id)
			await Message.deleteOne(filter) ;
		}
	}

	static async retrieveMessageContent(currentUserId, messageId) {
		const Message = getMessageModel() ;

		const filter = { destUserId: currentUserId, _id: messageId } ; // (match user and message id)
		const message = await Message.findOne(filter) ;
		if (!message) throw "MESSAGE_NOT_FOUND" ;
		return message.messageContent ;
	}

	static async findUsersByLocation(location) {
		const UserData = getUserDataModel() ;

		const filter = { "userProfile.location": location, "userProfile.locationPrivacy": {$ne: 'pri'} } ;
		const userDatas = await UserData.find(filter) ;
		return userDatas.map(userData => userData.userProfile.userName) ;
	}
}