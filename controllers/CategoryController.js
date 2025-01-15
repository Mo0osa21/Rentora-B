const { Category } = require('../models')

const GetCategorys = async (req, res) => {
  try {
    const categorys = await Category.find({})
    res.status(200).send(categorys)
  } catch (error) {
    throw error
  }
}

const CreateCategory = async (req, res) => {
  try {
    const category = await Category.create({ ...req.body })
    res.status(200).send(category)
  } catch (error) {
    throw error
  }
}

const UpdateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.category_id,
      req.body,
      {
        new: true
      }
    )
    res.status(200).send(category)
  } catch (error) {
    throw error
  }
}

const DeleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.category_id })
    res.status(200).send({
      msg: 'Category Deleted',
      payload: req.params.category_id,
      status: 'Ok'
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  GetCategorys,
  CreateCategory,
  UpdateCategory,
  DeleteCategory
}
