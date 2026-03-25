const joi=require("joi");
const listingschema=joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
    }).unknown(true);
const reviewschema=joi.object({
    comment:joi.string().required(),
    rating:joi.number().required().min(1).max(5)
});
module.exports={listingschema,reviewschema};
