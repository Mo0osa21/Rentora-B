const router = require('express').Router()
const controller = require('../controllers/PropertyController')
const middleware = require('../middleware')

// Get all properties with optional category filtering
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetProperties
)

// Get a single property by ID
router.get(
  '/:propertyId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetProperty
)

// Create a new property (admin or authorized user)
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateProperty
)

// Update a property by ID (admin or authorized user)
router.put(
  '/:propertyId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateProperty
)

// Delete a property by ID (admin or authorized user)
router.delete(
  '/:propertyId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteProperty
)

module.exports = router
