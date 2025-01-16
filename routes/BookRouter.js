const router = require('express').Router()
const controller = require('../controllers/BookController')
const middleware = require('../middleware')

// Get all bookings (books) in the system
router.get(
  '/all',
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
  '/place',
  middleware.stripToken,
  middleware.verifyToken,
  controller.PlaceBooking
)

// Update the status of a booking (e.g., Pending, Active, Cancelled)
router.put(
  '/update/:bookId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.AutoUpdateBookStatus
)

module.exports = router
