import express from "express";
import * as register from "./registrationController.mjs"
import { getUnsplashPic } from "./unsplashController.mjs";
const router = express.Router();

// Routes

router.get("/unsplash", getUnsplashPic)


export default router;