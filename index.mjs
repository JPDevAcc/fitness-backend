import { config } from "dotenv";
import express from "express";
import router from "./router.mjs";
import cors from "cors";
import mongoose from "mongoose";
import { authenticate, authorize } from "./auth.mjs";
import * as register from "./registrationController.mjs"
import session from "express-session";
import MemoryStoreClass from "memorystore";
const MemoryStore = MemoryStoreClass(session);

// Init dotenv
config();

// Express setup + middleware stack
const app = express();

// CORS
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
	secret: 'ah738dfusk626fuiakgheghbslgh56274',
	resave: false,
	saveUninitialized: true
}))

// Pre-auth routes
app.post("/register", register.userRegister);

// Auth
app.post("/auth", authenticate)
app.use(authorize)

// Post-auth routes
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