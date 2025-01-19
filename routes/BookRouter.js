const router = require('express').Router()
const controller = require('../controllers/BookController')
const middleware = require('../middleware')

// Get all bookings (books) in the system
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetAllBooks
)

// Get all bookings for a specific user
router.get(
  '/user',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserBooks
)

// Place a booking for a property
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.PlaceBooking
)

// Update the status of a booking (e.g., Pending, Active, Cancelled)
router.put(
  '/:bookId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.AutoUpdateBookStatus
)

router.get(
  '/property/:propertyId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetPropertyBookings
)

router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CancelBooking
)

module.exports = router
