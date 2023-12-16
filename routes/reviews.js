const express = require('express')
// mergeParams Para hacer merge a los params que vengan desde el app.use en index.js (:id)
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')

const Campground = require('../models/campgrounds/campground')
const Review = require('../models/reviews/review')
const { reviewSchema } = require('../schemas/index')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const newReview = new Review(req.body.review)
    campground.reviews.push(newReview)
    await newReview.save()
    await campground.save()
    req.flash('success', 'Successfully created a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    /**
     * * https://www.mongodb.com/docs/manual/reference/operator/update/pull/
     */
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    console.log(campground)
    const review = await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router