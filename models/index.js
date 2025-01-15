const mongoose = require('mongoose')
const userSchema = require('./User')
const categorySchema = require('./Category')
const bookSchema = require('./Book')
const propertySchema = require('./Property')
const reviewSchema = require('./Review')

const User = mongoose.model('User', userSchema)
const Category = mongoose.model('Category', categorySchema)
const Book = mongoose.model('Book', bookSchema)
const Property = mongoose.model('Property', propertySchema)
const Review = mongoose.model('Review', reviewSchema)

module.exports = {
  User,
  Category,
  Book,
  Property,
  Review
}
