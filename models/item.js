const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  itemImageUrl: [{ type: String }],
  stockCount: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

// Virtual for author's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/item/${this._id}`;
});
// Export model
module.exports = mongoose.model("Item", ItemSchema);
