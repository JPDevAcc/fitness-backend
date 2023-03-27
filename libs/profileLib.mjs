import { nonCryptoRandHexString } from "../utils/utils.mjs";
import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";
import UserData from "../models/userData.mjs"

export default class ProfileLib {
	// Set a random username (on first login)
	static async setInitialRandomUserName(userId) {
		while (true) {
			// Generate random username | 8 * 4 = 32 bits = 16 bits collision resistance
			// (should be okay until we have 100K+ users who don't bother changing their username)
			const userName = "User_" + nonCryptoRandHexString(8) ;
			const userData = new UserData({ _id: userId, "userProfile.userName": userName }) ;
			console.log("Trying new UserData ", userData) ;

			try {
				await userData.save() ;
			}
			catch(err) {
				if (err.code !== MONGO_ERR_DUPLICATE_KEY) throw (err) ; // Unknown error
				else {
					const dupField = Object.keys(err.keyValue)[0];
					if (dupField === '_id') return ; // (already exists so we don't need to create it)
				}
				// (otherwise it was a duplicate username so we go around the loop and try another one)
			}
		} ;
	}

	static async updateField(userId, fieldName, value) {
		const filter = { _id: userId } ;
		const update = { $set: { [`userProfile.${fieldName}`]: value } } ;
		await UserData.updateOne(filter, update); // (user profile should already exist at this point)
	}
}