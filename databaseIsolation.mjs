import copyCollections from "./utils/copyCollections.mjs";
import crypto from "crypto" ;

// Outer session for database isolation
// Note: We use this rather than IP address as it's a bit more reliable
// TODO: Add some kind of IP-based throttling as well?
export default async function databaseIsolation(req, res, next) {
	let isValidOuterSessionId = false ; 
	if (req.cookies.outerSession) {
		if (/^[0-9a-f]{16}$/.test(req.cookies.outerSession)) isValidOuterSessionId = true ;
		else console.error("Invalid outer session id") ;
	}
	if (isValidOuterSessionId) global.userCollectionsPrefix = req.cookies.outerSession + '_' ;
	else {
		// (64-bits is sufficient for this purpose - we don't want to make the collection names too long)
		const outerSessionId = crypto.randomBytes(8).toString('hex').padStart(8, '0') ;
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