const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  titel: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
