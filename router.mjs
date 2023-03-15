import express from "express";
import * as register from "./registrationController.mjs"
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


export default router;