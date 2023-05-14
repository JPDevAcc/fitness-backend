import copyCollections from "./utils/copyCollections.mjs";
import crypto from "crypto" ;

// Outer session for database isolation
// Note: We use this rather than IP address as it's a bit more reliable
// TODO: Add some kind of IP-based throttling as well?
export default async function databaseIsolation(req, res, next) {
	if (req.cookies.outerSession) global.userCollectionsPrefix = req.cookies.outerSession + '_' ;
	else {
		const outerSessionId = crypto.randomBytes(16).toString('base64') ;
		 const options = {
      httpOnly: true, // No JS access
			secure: true,
			sameSite: 'none'
    }
		res.cookie('outerSession', outerSessionId, options) ;
		global.userCollectionsPrefix = outerSessionId + '_' ;
	}
	await copyCollections() ;
	next() ;
}