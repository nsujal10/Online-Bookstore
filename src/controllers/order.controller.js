import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Book from "../models/book.model.js";
import AppError from "../utils/AppError.js";


// Place Order
export const placeOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return next(new AppError("Cart is empty", 400));
    }

    let totalAmount = 0;

    // Validate stock and calculate total
    for (const item of cart.items) {
      if (item.book.stock < item.quantity) {
        throw new AppError(`Not enough stock for ${item.book.title}`, 400);
      }

      totalAmount += item.book.price * item.quantity;

      // Deduct stock
      item.book.stock -= item.quantity;
      await item.book.save({ session });
    }

    // Create order
    const order = await Order.create(
      [{
        user: req.user._id,
        items: cart.items.map(item => ({
          book: item.book._id,
          quantity: item.quantity,
          price: item.book.price
        })),
        totalAmount
      }],
      { session }
    );

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: order[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.book");

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    next(error);
  }
};


export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (order.status !== "PLACED") {
      return next(new AppError("Cannot cancel this order", 400));
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    next(error);
  }
};
