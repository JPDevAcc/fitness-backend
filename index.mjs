import { config } from "dotenv";
import express from "express";
import router from "./router.mjs";
import cors from "cors";
import mongoose from "mongoose";
import * as auth from "./auth.mjs";
import * as userController from "./controllers/userController.mjs"
import * as fileDataController from "./controllers/fileDataController.mjs" ;
import * as userProfileController from "./controllers/userProfileController.mjs" ;
import session from "express-session";
import MemoryStoreClass from "memorystore";
const MemoryStore = MemoryStoreClass(session);
import expressMongoSanitize from "express-mongo-sanitize";
import databaseIsolation from "./databaseIsolation.mjs";
import cookieParser from 'cookie-parser';

// Init dotenv
config();

// Express setup + middleware stack
const app = express();

// Trust the proxy so that requests are marked secure and cookies are sent
app.set("trust proxy", true);

// CORS
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));

// Minimal CSRF protection via custom header (to protect the non-authorized routes)
// (we don't require it for GET requests as they SHOULD be safe)
function checkCustomHeader(req, res, next) {
	if (req.method !== 'GET' && !req.headers['x-requested-with']) return res.status(401).send() ; // (we don't care what it's actually set to)
	next() ;
}
app.use(checkCustomHeader) ;

// Other middleware
app.use(express.json({ limit: "1500kb" }));
app.use(express.urlencoded({ extended: true, limit: "1500kb" }));
app.use(cookieParser()) ;

// Database collection isolation
if (process.env.ENABLE_DB_ISOLATION === 'true') app.use(databaseIsolation) ;
else global.userCollectionsPrefix = '' ;
console.log("Database collection isolation is:", (process.env.ENABLE_DB_ISOLATION === 'true') ? 'ENABLED' : 'DISABLED') ;

// (See https://github.com/expressjs/session/issues/837)
function fakeSecure(req, res, next) {
	Object.defineProperty(req, 'secure', { get: () => true });
	next() ;
}
if (process.env.NODE_ENV === 'development' && process.env.FAKE_SECURE_EXPRESS_SESSION_WORKAROUND === 'true') {
	console.log("*** WARNING: FAKING SECURE CONNECTION ***")
	app.use(fakeSecure) ;
}

const secure = process.env.NODE_ENV !== 'development' || process.env.FAKE_SECURE_EXPRESS_SESSION_WORKAROUND === 'true' ;

const sessionCookieOpts = {
	maxAge: 24 * 60 * 60 * 1000,
	secure,
	httpOnly: true,
	sameSite: 'none'
} ;
console.log("Session cookie settings:", sessionCookieOpts) ;

app.use(session({
	cookie: sessionCookieOpts,
	store: new MemoryStore({
		checkPeriod: 1 * 60 * 60 * 1000 // prune expired entries every hour
	}),
	// TODO: Move this to .env (although it's PROBABLY not security critical, as long as the values are still unpredictable)
	secret: 'ah738dfusk626fuiakgheghbslgh56274',
	resave: false,
	saveUninitialized: true
}))

// Sanitise inputs for MongoDB queries
// This is a first line of defense - user inputs should still be validated
// TODO: Check that this is actually working
app.use(expressMongoSanitize());

// Pre-authorization routes
app.post("/register", userController.userRegister);
app.post("/auth", auth.authenticate) ;
app.post("/logout", auth.logout) ; // (note: we allow access even if user isn't authorized as we don't want a logout request to ever fail)
// Retrieve raw file (we do this here because the client doesn't send the token for ordinary file requests)
// (unfortunately this does mean that the user-privacy setting for profile-image public vs members-only is partially ignored - we could in future at least check the cookie)
app.get("/files/:fileName", fileDataController.getFile) ;
app.get("/profile/:userName", userProfileController.getProfile); // Retrieve profile for user

// Authorization check
app.use(auth.authorize) ;

// Post-authorization routes
app.use(router);

// Connect to DB
mongoose.connect(process.env.DBURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Database event handling
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); // Log connection errors
db.once('open', () => console.log("Database connected")); // Open the connection

// Listen for connections
const port = process.env.PORT || 3005;
app.listen(port, () => {
	console.log(`My app is listening on port: ${port}`);
});