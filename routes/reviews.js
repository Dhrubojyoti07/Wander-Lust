const app=require("express");
const router=app.Router();
const Data=require("../models/Listings.js");
const review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingschema,reviewschema}=require("../schema.js");
const {isReviewOwner,isLoggedIn,validatereview}=require("../middleware.js");
const reviewcontroller=require("../controller/review.js");
router.post("/view/:id/review",validatereview,isLoggedIn,wrapAsync(
    reviewcontroller.create
));
router.delete("/view/:id/review/:revid",isReviewOwner,isLoggedIn,wrapAsync(
    reviewcontroller.delete
));
module.exports=router;