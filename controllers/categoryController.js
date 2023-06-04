const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
// Display list of all books.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ categoryName: 1 }).exec();

  res.render("category_list", {
    title: "Categories",
    categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "itemName itemDescription").exec(),
  ]);
  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    items: items,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Create Category",
  });
});

exports.category_create_post = [
  // Validate and sanitize the name field.
  body("categoryName", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "categoryDescription",
    "Category description must contain at least 3 characters"
  )
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const category = new Category(req.body);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      await category.save();
      res.redirect(category.url);

      const categoryExists = await Category.findOne({
        categoryName: req.body.categoryName,
      }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];
