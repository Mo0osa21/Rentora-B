const { Book, Property } = require('../models')

// Get all books (orders) from the system
const GetAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate('user', 'name email') // Assuming the book is associated with the user
      .populate('propertyId') // Assuming book references the Property model
    res.status(200).send(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).send({ error: 'Failed to fetch books' })
  }
}

// Get all books for a specific user
const GetUserBooks = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const books = await Book.find({ user: userId }).populate('propertyId')
    res.status(200).send(books)
  } catch (error) {
    console.error('Error fetching user books:', error)
    res.status(500).send({ error: 'Failed to fetch user books' })
  }
}

// Update the booking status (e.g., Pending, Confirmed, Cancelled)
const UpdateBookStatus = async (req, res) => {
  try {
    const { bookId } = req.params
    const { status } = req.body

    const validStatuses = ['pending', 'active', 'expired']

    const normalizedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).send({ msg: 'Invalid status' })
    }

    const statusActions = {
      Confirmed: { confirmedAt: new Date() },
      Cancelled: { cancelledAt: new Date() }
    }

    const updateData = {
      status: normalizedStatus,
      ...statusActions[normalizedStatus]
    }

    const book = await Book.findByIdAndUpdate(bookId, updateData, { new: true })
    if (!book) {
      return res.status(404).send({ msg: 'Booking not found' })
    }

    res.status(200).send({
      msg: `Booking status updated to "${normalizedStatus}"`,
      book
    })
  } catch (error) {
    console.error('Error updating booking status:', error)
    res.status(500).send({ error: 'Failed to update booking status' })
  }
}

// Place a booking for a property (this would be equivalent to placing an order in an e-commerce system)
const PlaceBooking = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { property, startDate, endDate, totalPrice } = req.body

    const propertyU = await Property.findById(property)

    if (!propertyU) {
      return res.status(400).send({ msg: 'Property not found' })
    }

    // Create a new booking
    const newBooking = await Book.create({
      user: userId,
      property: propertyU,
      startDate,
      endDate,
      status: 'pending',
      totalPrice,
      bookingDate: new Date()
    })

    res.status(201).send({
      msg: 'Booking placed successfully',
      booking: newBooking
    })
  } catch (error) {
    console.error('Error placing booking:', error)
    res.status(500).send({ error: 'Failed to place booking' })
  }
}

module.exports = {
  GetAllBooks,
  GetUserBooks,
  PlaceBooking,
  UpdateBookStatus
}
