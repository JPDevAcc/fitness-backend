import NotificationsLib from "../libs/notificationsLib.mjs";

// Get notifications for user
export async function retrieve(req, res) {
	try {
  	return res.send(NotificationsLib.getNotificationsForUser(req.session.userId)) ;
	}
	catch(err) {
		console.error(err) ;
		return res.status(500).send({message: "Something went wrong!"})
	}
}