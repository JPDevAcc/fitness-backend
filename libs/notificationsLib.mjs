import Notification from "../models/notification.mjs";
import { trimWithEllipsis } from "../utils/utils.mjs";

export default class NotificationsLib {
	static async createNotification(userId, sourceType, sourceCollectionId) {
		const notification = new Notification({userId, sourceType, sourceCollectionId, isNewNotification: true}) ;
		await notification.save()
	}

	static async getNotificationsForUser(userId) {
		let notifications = [] ;
		notifications = [...notifications, ...this._getMessageNotifications(userId)] ;
		notifications = [...notifications, ...await this._getContactRequestNotifications(userId)] ;
		
		return notifications ;
	}

	// CURRENTLY MOCKED!
	static _getMessageNotifications(userId) {
		const senderUsername = 'Someone' ;
		const subject = 'Hi!' ;
		const messageId = 123 ;
		const message = 'This is just mocked for now - and some other text which is way too long but we only send the first 30 characters for the notification' ;
		const dateTime = new Date() ;
		return [
			{
				type: 'message',
				dataForType: {
					senderUsername,
					messageId,
					subject,
					msgSummary: trimWithEllipsis(message, 30)
				},
				dateTime
				}
		] ;
	}

	static async _getContactRequestNotifications(userId) {
		const senderUsername = 'NotImplemented' ;
		const requestId = 456 ;
		const dateTime = new Date() ;
		const mockNotification = {
			type: 'contact_request',
			dataForType: {
				senderUsername,
				requestId,
			},
			dateTime
		} ;

		// Get contact-request notifications
		// TODO: Join with User collection to determine username 
		const notifications = [] ;
		console.log("CHECKING FOR NOTIFICATIONS FOR USER WITH ID: ", userId) ;
		for await (const notification of Notification.find({ sourceType: 'notification', userId })) {
			notifications.push(mockNotification) ;
		}
		return notifications ;
	}
}