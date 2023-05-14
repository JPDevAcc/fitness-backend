import getUserDataModel from "../models/userData.mjs";

export default class NotificationsLib {
	static async getNotificationsForUser(userId) {
		const UserData = getUserDataModel() ;

		const userData = await UserData.findOne({ _id: userId }) ;
		let notifications = [] ;
		notifications = [...notifications, ...await this._getMessageNotifications(userData)] ;
		notifications = [...notifications, ...await this._getContactRequestNotifications(userData)] ;
		
		return notifications ;
	}

	static async _getMessageNotifications(userData) {
		const notifications = [] ;
		for (const messageMeta of userData.messageMetas) {
			const notification = {
				type: 'message',
				idForType: messageMeta._id,
				dateTime: messageMeta.dateTime,
				dataForType: {
					sourceImageUrl: messageMeta.sourceImageUrl,
					sourceUserName: messageMeta.sourceUserName,
					messageSubject: messageMeta.messageSubject,
					messageSummary: messageMeta.messageSummary
				}
			}
			notifications.push(notification) ;
		}
		return notifications ;
	}

	static async _getContactRequestNotifications(userData) {
		const notifications = [] ;
		for (const contactReq of userData.contactRequests) {
			const notification = {
				type: 'contact_request',
				idForType: contactReq.sourceUserName,
				dateTime: contactReq.dateTime,
				dataForType: {
					sourceImageUrl: contactReq.sourceImageUrl
				}
			}
			notifications.push(notification) ;
		}
		return notifications ;
	}
}