const Joi = require('joi');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  slug: Joi.string().min(2).max(80).optional()
});

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { error, value } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const slug = value.slug || slugify(value.name);
  const exists = await Category.findOne({ $or: [{ name: value.name }, { slug }] });
  if (exists) return res.status(400).json({ message: 'Category already exists' });

  const category = await Category.create({ name: value.name, slug });
  res.status(201).json(category);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { error, value } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const slug = value.slug || slugify(value.name);
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: value.name, slug },
    { new: true }
  );
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
});

