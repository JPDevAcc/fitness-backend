import express from "express";
import * as register from "./registrationController.mjs"
const router = express.Router() ;

// Routes
router.post("/register" , register.userRegister) ; // Register the user
export default router ;