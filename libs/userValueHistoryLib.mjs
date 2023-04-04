import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import UserValueHistory from "../models/userValueHistory.mjs";

export default class InitialHistorySetup {
	static async initialHistorySetup(userId) {
		const userValueHistory = new UserValueHistory({_id: userId}) ;
		try {
			await userValueHistory.save() ;
		}
		catch(err) {
			if (err.code !== MONGO_ERR_DUPLICATE_KEY) throw (err) ; // Unknown error
			// (ignore duplicate key error)
		}
	}

	static async setFieldForCurrentDay(userId, fieldName, value) {
		const dateOnlyString = new Date().toISOString().split('T')[0] ;

		const filter = { _id: userId, "historyValues.dateOnly": dateOnlyString} ;
		const update = { $set: { [`historyValues.$[].${fieldName}`]: value, "historyValues.$[].dateOnly": dateOnlyString } } ;
		const res = await UserValueHistory.updateOne(filter, update) ;

		if (res.matchedCount === 0) {
			const historyEntryData = { dateOnly: dateOnlyString, [fieldName]: value } ;
			const filter = { _id: userId } ;
			const update = { $push: { historyValues: historyEntryData }} ;
			await UserValueHistory.updateOne(filter, update);
		}
	}
}