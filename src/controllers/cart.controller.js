import Cart from "../models/cart.model.js";
import Book from "../models/book.model.js";
import AppError from "../utils/AppError.js";


// Get Cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");

    res.status(200).json({
      success: true,
      data: cart || { items: [] }
    });

  } catch (error) {
    next(error);
  }
};


// Add to Cart
export const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;

    if (quantity <= 0) {
      return next(new AppError("Quantity must be greater than 0", 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    if (book.stock < quantity) {
      return next(new AppError("Not enough stock", 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ book: bookId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.book.toString() === bookId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ book: bookId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart
    });

  } catch (error) {
    next(error);
  }
};


// Remove item
export const removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return next(new AppError("Cart not found", 404));

    cart.items = cart.items.filter(
      item => item.book.toString() !== bookId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });

  } catch (error) {
    next(error);
  }
};
