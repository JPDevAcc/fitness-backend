import UserData from "../models/userData.mjs";
import { trimWithEllipsis } from "../utils/utils.mjs";

export default class NotificationsLib {
	static async getNotificationsForUser(userId) {
		let notifications = [] ;
		notifications = [...notifications, ...await this._getMessageNotifications(userId)] ;
		notifications = [...notifications, ...await this._getContactRequestNotifications(userId)] ;
		
		return notifications ;
	}

	// CURRENTLY MOCKED!
	static async _getMessageNotifications(destUserId) {
		const senderUsername = 'Someone' ;
		const subject = 'Hi!' ;
		const messageId = 123 ;
		const message = 'This is just mocked for now - and some other text which is way too long but we only send the first 30 characters for the notification' ;
		const dateTime = new Date() ;
		return [
			{
				type: 'message',
				idForType: messageId,
				dataForType: {
					senderUsername,
					subject,
					msgSummary: trimWithEllipsis(message, 30)
				},
				dateTime
			}
		] ;
	}

	static async _getContactRequestNotifications(destUserId) {
		// Get contact-request notifications
		const notifications = [] ;
		console.log("CHECKING FOR CONTACT-REQUEST NOTIFICATIONS FOR USER WITH ID: ", destUserId) ;
		for await (const userData of UserData.find({ _id: destUserId })) {
			for (const contactReq of userData.contactRequests) {
				const notification = {
					type: 'contact_request',
					idForType: contactReq.sourceUserName,
					dataForType: {
						sourceImageUrl: contactReq.sourceImageUrl
					},
					dateTime: contactReq.dateTime
				}
				notifications.push(notification) ;
			}
		}
		return notifications ;
	}
}