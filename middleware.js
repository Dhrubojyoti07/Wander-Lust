const { listingschema, reviewschema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Data = require("./models/Listings.js");
const review = require("./models/review.js");
const isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    return next();
};

const saveredirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectUrl = req.session.returnTo;
        delete req.session.returnTo;
    }
    next();
};

const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Data.findById(id);
    if (!listing) {
        req.flash("error", "listing was not found");
        return res.redirect("/home");
    }
    if (!listing.User.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that");
        return res.redirect(`/view/${id}`);
    }
    return next();
};
const isReviewOwner = async (req, res, next) => {
    const { id,revid } = req.params;
    const reviews = await review.findById(revid);
    if (!reviews) {
        req.flash("error", "Review was not found");
        return res.redirect("/home");
    }
    if (!reviews.User._id.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that");
        return res.redirect(`/view/${id}`);
    }
    return next();
};

const validatelisting = (req, res, next) => {
    const result = listingschema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error.details.map((el) => el.message).join(","));
    }
    return next();
};

const validatereview = (req, res, next) => {
    const result = reviewschema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error.details.map((el) => el.message).join(","));
    }
    return next();
};

module.exports = {
    isLoggedIn,
    saveredirectUrl,
    isOwner,
    isReviewOwner,
    validatelisting,
    validatereview,
};