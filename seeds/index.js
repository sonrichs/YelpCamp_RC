const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campgrounds/camground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch((err) => {
        console.log(err)
    })

mongoose.connection.on('error', err => {
    logError(err);
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore velit fugit aperiam adipisci. Quo modi, architecto itaque officiis doloribus iste distinctio harum culpa reiciendis minima assumenda pariatur eaque aut illum?',
            price
        })
        await camp.save()
    }
    // const c = new Campground({ title: 'purple field' })
    // await c.save()
}

seedDB().then(() => {
    mongoose.connection.close()
})