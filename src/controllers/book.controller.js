import Book from "../models/book.model.js";
import AppError from "../utils/AppError.js";

export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, genre, minPrice, maxPrice, search } = req.query;

    const query = {};

    if (genre) query.genre = genre;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });

  } catch (error) {
    next(error);
  }
};

export const getSingleBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    res.status(200).json({
      success: true,
      data: book
    });

  } catch (error) {
    next(error);
  }
};


export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    res.status(200).json({
      success: true,
      data: book
    });

  } catch (error) {
    next(error);
  }
};


export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};
