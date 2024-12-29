import mongoose from "mongoose";
import { Order } from "../model/Order.js";
import { Product } from "../model/Product.js";
import { User } from "../model/User.js";
import { sendMail, invoiceTemplate } from "../services/common.js";

export const fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id }).populate('items.productId');;
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    console.log("Order items received:", req.body);

    
    // Loop through order items to update product stock
    for (let item of order.items) {
      let product = await Product.findById(item.productId); // Fetch product by ID

      // Check if product exists
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      // Check for sufficient stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${item.productId}` });
      }

      // Update the stock
      product.stock -= item.quantity; // Deduct the quantity
      await product.save(); // Save the updated product
    }

    // Save the order to the database
    const savedOrder = await order.save(); // Save order first

    // Populate product details in the saved order
    const populatedOrder = await Order.findById(savedOrder._id).populate('items.productId');

    // Fetch the user associated with the order
    const user = await User.findById(order.user);
    
    // Send email notification with proper structure
    await sendMail({
      to: user.email,
      html: invoiceTemplate(populatedOrder.items), // Pass the populated order items to the template
      subject: "Order Received",
    });

    // Return the populated order
    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(400).json({ message: 'Error creating order', error: err.message });
  }
};




export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

// import mongoose from 'mongoose';

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const orderData = req.body;

  // Convert productId to ObjectId in the items array
  if (orderData.items) {
    orderData.items = orderData.items.map(item => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId), // Ensure productId is an ObjectId
    }));
  }

  try {
    const order = await Order.findByIdAndUpdate(id, orderData, {
      new: true,
      runValidators: true, // Ensure validators run
    });
    res.status(200).json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};


export const fetchAllOrders = async (req, res) => {
  let query = Order.find({ deleted: { $ne: true } }).populate('items.productId'); // Populate productId

  const totalDocs = await Order.countDocuments({ deleted: { $ne: true } }).exec();

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
