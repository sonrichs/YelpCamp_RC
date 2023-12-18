const Campground = require('../models/campgrounds/campground')
const Review = require('../models/reviews/review')

const createReview = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const newReview = new Review(req.body.review)
    newReview.author = req.user._id
    campground.reviews.push(newReview)
    await newReview.save()
    await campground.save()
    req.flash('success', 'Successfully created a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    /**
     * * https://www.mongodb.com/docs/manual/reference/operator/update/pull/
     */
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    const review = await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports = {
    createReview,
    deleteReview
}