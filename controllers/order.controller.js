import Order from "../models/order.model.js";

//Add new order
const createOrder = async (req, res) => {
  try {
    req.body.orderID = (await Order.countDocuments()) + 1;
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      return res.status(404).json({ message: "Orders collection is empty" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get order by ID, product or date
const getOrder = async (req, res) => {
  try {
    const { filter } = req.params;
    let result;
    // Check if filter is a date in the format "DD-MM-YYYY"
    if (/^\d{2}-\d{2}-\d{4}$/.test(filter)) {
      result = await Order.find({ date: filter });
      // Check if filter is a number
    } else if (/\d/.test(filter)) {
      result = await Order.findOne({ orderID: filter });
    } else {
      result = await Order.find({ products: { $in: filter } });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update order
const updateOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const newOrder = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderID: orderID },
      { $set: newOrder },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete order
const deleteOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const order = await Order.findOneAndDelete({ orderID: orderID });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: `Order ${orderID} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder };
