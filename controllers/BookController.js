const { Book, Property } = require('../models')

// Get all books (orders) from the system
const GetAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate('user', 'name email') // Assuming the book is associated with the user
      .populate('property') // Assuming book references the Property model
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
    const books = await Book.find({ user: userId }).populate('property')
    res.status(200).send(books)
  } catch (error) {
    console.error('Error fetching user books:', error)
    res.status(500).send({ error: 'Failed to fetch user books' })
  }
}

const AutoUpdateBookStatus = async (req, res) => {
  try {
    const { bookId } = req.params

    // Find the booking by ID
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).send({ msg: 'Booking not found' })
    }

    const currentDate = new Date()

    // Determine status based on the current date
    let updatedStatus = book.status

    if (currentDate < book.startDate) {
      updatedStatus = 'pending'
    } else if (currentDate >= book.startDate && currentDate <= book.endDate) {
      updatedStatus = 'active'
    } else if (currentDate > book.endDate) {
      updatedStatus = 'expired'
    }

    // Only update if the status has changed
    if (book.status !== updatedStatus) {
      book.status = updatedStatus
      await book.save()
    }

    res.status(200).send({
      msg: `Booking status auto-updated to "${updatedStatus}"`,
      book
    })
  } catch (error) {
    console.error('Error auto-updating booking status:', error)
    res.status(500).send({ error: 'Failed to auto-update booking status' })
  }
}

const PlaceBooking = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { property, startDate, endDate } = req.body

    const propertyU = await Property.findById(property)

    if (!propertyU) {
      return res.status(400).send({ msg: 'Property not found' })
    }

    // Calculate the number of reserved days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end - start
    const daysReserved = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    if (daysReserved < 0) {
      return res.status(400).send({ msg: 'Invalid reservation dates' })
    }

    // Ensure a minimum of 1 day charge if start and end dates are the same
    const actualDaysReserved = daysReserved === 0 ? 1 : daysReserved

    // Calculate total price
    const totalPrice = propertyU.discountedPrice * actualDaysReserved

    // Create a new booking
    const newBooking = await Book.create({
      user: userId,
      property: propertyU._id,
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

const GetPropertyBookings = async (req, res) => {
  try {
    const bookings = await Book.find({ property: req.params.propertyId })
    res.status(200).json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ msg: 'Failed to fetch bookings' })
  }
}

const CancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id
    const userId = res.locals.payload.id

    // Find the booking
    const booking = await Book.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' })
    }

    // Check if the user owns the booking
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ msg: 'Unauthorized action' })
    }

    // Delete the booking
    await Book.findByIdAndDelete(bookingId)

    res.status(200).json({ msg: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Error deleting booking:', error)
    res.status(500).json({ msg: 'Server error' })
  }
}

module.exports = {
  GetAllBooks,
  GetUserBooks,
  PlaceBooking,
  AutoUpdateBookStatus,
  GetPropertyBookings,
  CancelBooking
}
