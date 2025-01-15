const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  location: {
    type: String,
    required: true,
    min: 0
  },
  amenities: [
    {
      type: String,
      required: false
    }
  ],
  availability: {
    type: Boolean,
    required: true,
    default: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  discountedPrice: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = propertySchema
