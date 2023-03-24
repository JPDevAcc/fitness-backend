import ContactRequest from "../models/contactRequest.mjs";
import NotificationsLib from "./notificationsLib.mjs";

export default class SocialLib {
	static async addContactRequestByUserIds(sourceUserId, destUserId) {
		const contactRequest = new ContactRequest({sourceUserId, destUserId, timestamp: new Date()}) ;
		await contactRequest.save() ;

		// Create associated notification
		const contactRequestId = 123 ; // TODO: Get actual contact request ID
		NotificationsLib.createNotification(destUserId, 'notification', contactRequestId) ;
	}
}