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
  AutoUpdateBookStatus
}
