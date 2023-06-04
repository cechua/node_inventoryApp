var express = require("express");
var router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Category */
router.get("/category", category_controller.category_list);
router.get("/category/:id", category_controller.category_detail);
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
//router.get("/category/:id/update", category_controller.category_update_get);
//router.post("/category/:id/update", category_controller.category_update_post);
/* Item */
router.get("/items", item_controller.item_list);
router.get("/item/create", item_controller.item_create_get);
router.post("/item/create", item_controller.item_create_post);
router.get("/item/:id", item_controller.item_detail);
router.get("/item/:id/update", item_controller.item_update_get);
router.post("/item/:id/update", item_controller.item_update_post);
router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);
module.exports = router;
