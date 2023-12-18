const express = require('express')
// mergeParams Para hacer merge a los params que vengan desde el app.use en index.js (:id)
const router = express.Router({ mergeParams: true })
const reviews = require('../controllers/reviews')
const catchAsync = require('../utilities/catchAsync')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router