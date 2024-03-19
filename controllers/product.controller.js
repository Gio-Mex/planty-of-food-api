import Product from "../models/product.model.js";

//Add new product
const createProduct = async (req, res) => {
  try {
    const { name } = req.body;
    let product = await Product.findOne({ name: name });
    if (product) {
      return res.status(400).json({ message: "Product already exists" });
    }
    product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "Products collection is empty" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get product by name
const getProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.findOne({ name: name });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update product
const updateProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const newName = req.body.name;
    const updatedProduct = await Product.findOneAndUpdate(
      { name: name },
      { name: newName },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete product
const deleteProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.findOneAndDelete({ name: name });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: `${name} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
