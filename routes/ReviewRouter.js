const router = require('express').Router()
const controller = require('../controllers/ReviewController')
const middleware = require('../middleware')

// Get all reviews for a specific property
router.get(
  '/:propertyId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.getReviewsForProperty
)

// Add a review for a property
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.addReview
)

// Check if a user is eligible to review a property (has a confirmed booking)
router.get(
  '/eligibility/:userId/:propertyId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.checkEligibility
)

// Edit an existing review
router.put(
  '/:reviewId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.editReview
)

// Delete a review
router.delete(
  '/:reviewId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.deleteReview
)

module.exports = router
