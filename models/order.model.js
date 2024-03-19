import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  orderID: {
    type: Number,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: () => {
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formattedDate = `${day}-${month}-${date.getFullYear()}`; //gg-mm-yyyy format
      return formattedDate;
    },
  },
});

const Order = model("Order", orderSchema);
export default Order;
