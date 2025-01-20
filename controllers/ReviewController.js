const { Review } = require('../models')
const { Book } = require('../models')

// Get all reviews for a property
const getReviewsForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params
    const reviews = await Review.find({ propertyId }).populate('userId', 'name')
    res.status(200).json(reviews)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch reviews', error: error.message })
  }
}

// Add a review for a property
const addReview = async (req, res) => {
  try {
    const { propertyId, userId, comment, rating } = req.body

    // Ensure the user has booked the property and the status is "Confirmed"
    const eligibleBooking = await Book.findOne({
      user: userId,
      property: propertyId,
      status: 'expired'
    })

    if (!eligibleBooking) {
      return res
        .status(403)
        .json({ message: 'You are not eligible to comment on this property.' })
    }

    // Create a new review
    const review = new Review({
      propertyId,
      userId,
      comment,
      rating
    })

    await review.save()
    res.status(201).json({ message: 'Review added successfully', review })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to add review', error: error.message })
  }
}

// Check if a user is eligible to review a property
const checkEligibility = async (req, res) => {
  try {
    const { userId, propertyId } = req.params

    const eligibleBooking = await Book.findOne({
      user: userId,
      property: propertyId,
      status: { $in: ['expired', 'expired'] }
    })

    res.status(200).json(eligibleBooking)
  } catch (error) {
    console.error('Error checking eligibility:', error)
    res
      .status(500)
      .json({ message: 'Failed to check eligibility', error: error.message })
  }
}

// Edit an existing review
const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { userId, comment, rating } = req.body

    // Find the review and check ownership
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to edit this review' })
    }

    // Update the review
    review.comment = comment
    review.rating = rating
    await review.save()

    res.status(200).json({ message: 'Review updated successfully', review })
  } catch (error) {
    console.error('Error editing review:', error)
    res
      .status(500)
      .json({ message: 'Failed to edit review', error: error.message })
  }
}

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { userId } = req.body

    // Find the review and check ownership
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this review' })
    }

    // Delete the review
    await review.deleteOne({ _id: reviewId })
    res.status(200).json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    res
      .status(500)
      .json({ message: 'Failed to delete review', error: error.message })
  }
}

module.exports = {
  getReviewsForProperty,
  addReview,
  checkEligibility,
  deleteReview,
  editReview
}
