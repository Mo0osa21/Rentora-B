const { User } = require('../models')
const middleware = require('../middleware')

const Register = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { email, password, name } = req.body
    // Hashes the provided password
    let passwordDigest = await middleware.hashPassword(password)
    // Checks if there has already been a user registered with that email
    let existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .send('A user with that email has already been registered!')
    } else {
      // Creates a new user
      const user = await User.create({ name, email, passwordDigest })
      // Sends the user as a response
      res.status(200).send(user)
    }
  } catch (error) {
    throw error
  }
}

const Login = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { email, password } = req.body
    // Finds a user by a particular field (in this case, email)
    const user = await User.findOne({ email })
    // Checks if the password matches the stored digest
    let matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )
    // If they match, constructs a payload object of values we want on the front end
    if (matched) {
      let payload = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name
      }
      // Creates our JWT and packages it with our payload to send as a response
      let token = middleware.createToken(payload)
      return res.status(200).send({ user: payload, token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .send({ status: 'Error', msg: 'An error has occurred logging in!' })
  }
}

const UpdatePassword = async (req, res) => {
  try {
    // Extract the old and new password from the request body
    const { oldPassword, newPassword } = req.body

    // Find the user by their ID from the request parameters
    const user = await User.findById(req.params.user_id)

    // If user not found, send an error response
    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found!' })
    }

    // Check if the old password matches the stored password hash
    const matched = await middleware.comparePassword(
      oldPassword,
      user.passwordDigest
    )

    // If passwords don't match, return an error
    if (!matched) {
      return res
        .status(401)
        .send({ status: 'Error', msg: 'Old password did not match!' })
    }

    // Hash the new password
    const newPasswordDigest = await middleware.hashPassword(newPassword)

    // Update the user's password in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.user_id,
      { passwordDigest: newPasswordDigest },
      { new: true } // Returns the updated user
    )

    // Prepare the response payload (excluding password)
    const payload = {
      id: updatedUser._id,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      name: updatedUser.name
    }

    // Send a success response with the updated user data
    return res.status(200).send({ status: 'Password Updated!', user: payload })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      status: 'Error',
      msg: 'An error occurred updating the password!'
    })
  }
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.status(200).send(payload)
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  CheckSession
}
