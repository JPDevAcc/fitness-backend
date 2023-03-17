import express from "express";
import * as userProfileController from "./controllers/userProfileController.mjs" ;
import * as testController from "./controllers/testController.mjs" ;
import { getUnsplashPic } from "./controllers/unsplashController.mjs";
const router = express.Router();

// Routes
router.get("/unsplash", getUnsplashPic)
router.patch("/profile/:fieldName", userProfileController.updateProfile) ; // Create or update user-profile

router.get("/all", testController.getAll) ; // GET ALL DOCUMENTS FROM DATABASE | TODO: REMOVE IN PRODUCTION!!!!!!!!

export default router;