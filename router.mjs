import express from "express";
import * as userProfileController from "./userProfileController.mjs" ;
import * as testController from "./testController.mjs" ;
import { getUnsplashPic } from "./unsplashController.mjs";
const router = express.Router();

// Routes
router.post('/logout', (req, res, next) => {
    req.session.user = null;
    req.session.save(function (err) {
        if (err) return next(err)
        req.session.regenerate(function (err) {
            if (err) next(err)
            req.session.regenerate(function (err) {
                if (err) next(err)
                res.redirect('/')
            })
        })
    })
})

router.get("/unsplash", getUnsplashPic)
router.patch("/profile/:fieldName", userProfileController.updateProfile) ; // Create or update user-profile

router.get("/all", testController.getAll) ; // GET ALL DOCUMENTS FROM DATABASE | TODO: REMOVE IN PRODUCTION!!!!!!!!

export default router;