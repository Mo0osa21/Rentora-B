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

    // Assuming the user ID is passed from the authentication middleware
    const userId = res.locals.payload.id

    const discountedPrice =
      discount > 0
        ? (price - (price * discount) / 100)
        : price

    const property = await Property.create({
      name,
      description,
      price,
      discount,
      discountedPrice,
      imageUrl,
      category,
      location,
      amenities,
      user: userId // Add user ID to property
    })

    res.status(200).send(property)
  } catch (error) {
    console.error('Error creating property:', error)
    res.status(500).send({ error: 'Error creating property' })
  }
}
const UpdateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params // Get propertyId from the route
    const {
      name,
      description,
      price,
      discount,
      imageUrl,
      category,
      location,
      amenities,
      availability
    } = req.body // Get the fields to update

    // Calculate discounted price if there's a discount
    const discountedPrice =
      discount > 0
        ? (price - (price * discount) / 100).toFixed(2)
        : price.toFixed(2)

    // Find the property and update it
    const property = await Property.findByIdAndUpdate(
      propertyId,
      {
        name,
        description,
        price,
        discount,
        discountedPrice,
        imageUrl,
        category,
        location,
        amenities,
        availability
      },
      { new: true } // Return the updated property
    )

    // If property is not found
    if (!property) {
      return res
        .status(404)
        .send({ msg: 'Property not found', status: 'Error' })
    }

    // Successfully updated
    res.status(200).send({
      msg: 'Property updated successfully.',
      property
    })
  } catch (error) {
    console.error('Error updating property:', error)
    res.status(500).send({
      msg: 'Failed to update property. Please try again later.',
      status: 'Error'
    })
  }
}

const DeleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params

    // Attempt to delete the property by its ID
    const deletedProperty = await Property.deleteOne({ _id: propertyId })

    // If no property was deleted (i.e., not found)
    if (deletedProperty.deletedCount === 0) {
      return res.status(404).send({
        msg: 'Property not found.',
        status: 'Error'
      })
    }

    // Success response if property was deleted
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

const GetUserProperties = async (req, res) => {
  try {
    // Get user ID from authentication middleware
    const userId = res.locals.payload.id

    // Fetch properties that belong to the logged-in user
    const properties = await Property.find({ user: userId }).populate(
      'category'
    )

    // If no properties found, return a message
    if (properties.length === 0) {
      return res
        .status(404)
        .send({ msg: 'No properties found for this user', status: 'Error' })
    }

    res.status(200).send(properties)
  } catch (error) {
    console.error('Error fetching user properties:', error)
    res.status(500).send({ error: 'Error fetching user properties' })
  }
}

module.exports = {
  GetProperties,
  GetProperty,
  CreateProperty,
  UpdateProperty,
  DeleteProperty,
  GetUserProperties
}
