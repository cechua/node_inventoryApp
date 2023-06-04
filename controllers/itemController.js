const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find().populate("category").exec();
  res.render("item_list", {
    title: "Item List",
    items: items,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ categoryName: 1 }).exec();

  res.render("item_form", {
    title: "Create Item",
    categories: allCategories,
  });
});

// Create new item
exports.item_create_post = [
  // Validate and sanitize the name field.
  body("itemName", "Item name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemDescription", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemPrice", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const item = new Item(req.body);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("item_form", {
        title: "Create Item",
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  console.log(item);
  res.render("item_detail", {
    title: "Item Detail",
    item: item,
  });
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find().sort({ categoryName: 1 }).exec(),
  ]);
  res.render("item_form", {
    title: "Update Item",
    item: item,
    categories: categories,
  });
});
exports.item_update_post = [
  // Validate and sanitize the name field.
  body("itemName", "Item name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemDescription", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("itemPrice", "Item description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Item object with escaped/trimmed data and old id.
    const item = new Item({
      itemName: req.body.itemName,
      itemDescription: req.body.itemDescription,
      itemPrice: req.body.itemPrice,
      stockCount: req.body.stockCount,
      category: req.body.category,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });
    const [categories] = await Promise.all([
      Category.find().sort({ categoryName: 1 }).exec(),
    ]);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      console.log("toupdate");
      const newItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(newItem.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  });
});
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.body.itemId);
  res.redirect("/items");
});
