const Joi = require('./sanitizeHtml')

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        // image: Joi.string().uri().required(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})