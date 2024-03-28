import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productID: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Product = model("Product", productSchema);
export default Product;
