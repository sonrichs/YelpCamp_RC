const express = require('express')
const router = express.Router()

const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')

const Campground = require('../models/campgrounds/campground')
const { campgroundSchema } = require('../schemas/index')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params
    // req.body.campground porque en el form de edit tengo el parametro 'name' de los inputs como 'campground[xxx]'
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true })
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds')
}))

module.exports = router