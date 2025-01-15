const { Property } = require('../models')
const { Book } = require('../models')
const mongoose = require('mongoose')

// Get all properties with optional category filtering
const GetProperties = async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) {
      filter.category = req.query.category
    }
    const properties = await Property.find(filter).populate('category')
    res.status(200).send(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    res.status(500).send({ error: 'Error fetching properties' })
  }
}

// Get a single property by ID
const GetProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId).populate(
      'category'
    )
    if (!property) {
      return res
        .status(404)
        .send({ msg: 'Property not found', status: 'Error' })
    }
    res.status(200).send(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    res.status(500).send({ error: 'Error fetching property' })
  }
}

// Create a new property
const CreateProperty = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      imageUrl,
      category,
      location,
      amenities
    } = req.body

    const discountedPrice =
      discount > 0
        ? (price - (price * discount) / 100).toFixed(2)
        : price.toFixed(2)

    const property = await Property.create({
      name,
      description,
      price,
      discount,
      discountedPrice,
      imageUrl,
      category,
      location,
      amenities
    })

    res.status(200).send(property)
  } catch (error) {
    console.error('Error creating property:', error)
    res.status(500).send({ error: 'Error creating property' })
  }
}

// Update a property by ID
const UpdateProperty = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      imageUrl,
      category,
      location,
      amenities
    } = req.body

    let discountedPrice = price
    if (discount > 0) {
      discountedPrice = (price - (price * discount) / 100).toFixed(2)
    }

    const property = await Property.findByIdAndUpdate(
      req.params.propertyId,
      {
        name,
        description,
        price,
        discount,
        discountedPrice,
        imageUrl,
        category,
        location,
        amenities
      },
      { new: true }
    )

    if (!property) {
      return res
        .status(404)
        .send({ msg: 'Property not found', status: 'Error' })
    }

    res.status(200).send(property)
  } catch (error) {
    console.error('Error updating property:', error)
    res.status(500).send({ error: 'Error updating property' })
  }
}

// Delete a property by ID
const DeleteProperty = async (req, res) => {
  try {
    const propertyId = mongoose.Types.ObjectId(req.params.propertyId)

    // Check if the property has active bookings
    const hasBookings = await Book.findOne({ property: propertyId })
    if (hasBookings) {
      return res.status(400).send({
        msg: 'Property cannot be deleted as it has active bookings.',
        status: 'Error'
      })
    }

    const deletedProperty = await Property.deleteOne({ _id: propertyId })
    if (deletedProperty.deletedCount === 0) {
      return res.status(404).send({
        msg: 'Property not found.',
        status: 'Error'
      })
    }

    res.status(200).send({
      msg: 'Property deleted successfully.',
      payload: propertyId,
      status: 'Ok'
    })
  } catch (error) {
    console.error('Error deleting property:', error)
    res.status(500).send({
      msg: 'Failed to delete property. Please try again later.',
      status: 'Error'
    })
  }
}

module.exports = {
  GetProperties,
  GetProperty,
  CreateProperty,
  UpdateProperty,
  DeleteProperty
}
