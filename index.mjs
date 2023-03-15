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

// https://www.npmjs.com/package/memorystore

// Init dotenv
config();

// Express setup + middleware stack
const app = express();

// CORS
app.use(cors());

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
	cookie: {
		maxAge: 24 * 60 * 60 * 1000,
		secure: false
	},
	store: new MemoryStore({
		checkPeriod: 1 * 60 * 60 * 1000 // prune expired entries every 24h
	}),
	secret: 'ah738dfusk626fuiakgheghbslgh56274',
	resave: false,
	saveUninitialized: true
}))

app.post("/register", register.userRegister);
app.post("/auth", authenticate)
app.use(authorize)

// Routes
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