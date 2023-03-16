import express from "express";
import * as userProfileController from "./userProfileController.mjs" ;
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

export default router;