import express from "express";
import * as userController from "./controllers/userController.mjs"
import * as userDataController from "./controllers/userDataController.mjs";
import * as userPrefsController from "./controllers/userPrefsController.mjs";
import * as userProfileController from "./controllers/userProfileController.mjs";
import * as notificationsController from "./controllers/notificationsController.mjs";
import * as socialController from "./controllers/socialController.mjs";
import * as testController from "./controllers/testController.mjs";
import { getUnsplashPic } from "./controllers/unsplashController.mjs";
import { getRecipe, addPicture, addRecipe, getSavedRecipes, getFullRecipe, getIngredientInfo, getIngredientID } from "./controllers/recipeController.mjs";
import { getBodyparts, getExercise } from "./controllers/exerciseController.mjs";
import { addCommunityPost, getCommunityPosts } from "./controllers/communityPostsController.mjs";

const router = express.Router();

// Main routes
router.post("/changepass", userController.userChangePwd); // Change user-password
router.post("/delaccount", userController.userDeleteAccount); // Delete user-account
router.get("/userdata", userDataController.retrieve); // Retrieve user-data (prefs, profile, etc)
router.patch("/prefs/:fieldName", userPrefsController.updatePrefs); // Update user-prefs
router.post("/profile/image/:category", userProfileController.updateImage) ; // Update image for user
router.delete("/profile/image/:category", userProfileController.removeImage) ; // Remove image for user
router.patch("/profile/:fieldName", userProfileController.updateProfile); // Update user-profile
router.get("/notifications", notificationsController.retrieve); // Get notifications for current user
router.put("/contactrequests/:destUserName", socialController.createContactRequest); // Create a contact-request

// API relays
router.get("/unsplash", getUnsplashPic); // Get picture from API
router.post("/addPicture", addPicture); // Add picture to database
router.get("/bodyparts", getBodyparts);
router.get("/exercises/bodypart/:bodypart", getExercise);

router.get("/recipe/:query", getRecipe); // Get recipe from API
router.get("/fullrecipe/:id", getFullRecipe); // Get FULL recipe from API
router.get("/ingredient/:query", getIngredientID); // Get ingredient ID from API
router.get("/ingredient/:id/:amount/:unit", getIngredientInfo); // Get ingredient info from API

router.post("/post", addCommunityPost) // Add post to database
router.get("/posts", getCommunityPosts)

router.post("/addRecipe", addRecipe); // Add recipe to database
router.get("/allrecipes", getSavedRecipes)

// DEVELOPMENT-ONLY
if (process.env.NODE_ENV === 'development') {
    router.get("/all", testController.getAll); // GET ALL DOCUMENTS FROM DATABASE | TODO: REMOVE IN PRODUCTION!!!!!!!!
}

export default router;