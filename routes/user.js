const app=require("express");
const router=app.Router();
const User=require("../models/User.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const passport = require("passport");
const {saveredirectUrl}=require("../middleware.js");
const usercontroller=require("../controller/user.js");
router.get("/signup",
    usercontroller.renderSignupForm
);
router.post("/signup/new",wrapAsync(
    usercontroller.signup
));
router.get("/login",
    usercontroller.renderLoginForm
);
router.post("/login/new",saveredirectUrl,passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login"
}),wrapAsync(
    usercontroller.login
));
router.get("/logout",
    usercontroller.logout
);
module.exports=router;
