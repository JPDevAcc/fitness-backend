import { trimWithEllipsis } from "../utils/utils.mjs";

export default class NotificationsLib {
	static getNotificationsForUser(userId) {
		let notifications = [] ;
		notifications = [...notifications, ...this._getMessageNotifications(userId)] ;
		notifications = [...notifications, ...this._getContactRequestNotifications(userId)] ;
		
		return notifications ;
	}

	// CURRENTLY MOCKED!
	static _getMessageNotifications(userId) {
		const senderUsername = 'Someone' ;
		const subject = 'Hi!' ;
		const messageId = 123 ;
		const message = 'Some message which is way too long but we only send the first 30 characters for the notification' ;
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

	// CURRENTLY MOCKED!
	static _getContactRequestNotifications(userId) {
		const senderUsername = 'SomeoneElse' ;
		const requestId = 456 ;
		const dateTime = new Date() ;
		return [
			{
				type: 'contact_request',
				dataForType: {
					senderUsername,
					requestId,
				},
				dateTime
				}
		] ;
	}
}