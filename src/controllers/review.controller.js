import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import Book from "../models/book.model.js";
import AppError from "../utils/AppError.js";


// Add Review
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.bookId;

    // Check if user purchased this book
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "items.book": bookId,
      status: { $in: ["PLACED", "SHIPPED", "DELIVERED"] }
    });

    if (!hasPurchased) {
      return next(new AppError("You can review only purchased books", 403));
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment
    });

    // Recalculate average rating
    const stats = await Review.aggregate([
      { $match: { book: review.book } },
      {
        $group: {
          _id: "$book",
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    await Book.findByIdAndUpdate(bookId, {
      ratingAvg: stats[0].avgRating
    });

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    next(error);
  }
};


// Get Reviews for a Book
export const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, sort = "latest" } = req.query;

    const sortOption = sort === "highest"
      ? { rating: -1 }
      : { createdAt: -1 };

    const reviews = await Review.find({ book: req.params.bookId })
      .populate("user", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalReviews = await Review.countDocuments({
      book: req.params.bookId
    });

    res.status(200).json({
      success: true,
      totalReviews,
      currentPage: Number(page),
      totalPages: Math.ceil(totalReviews / limit),
      data: reviews
    });

  } catch (error) {
    next(error);
  }
};

