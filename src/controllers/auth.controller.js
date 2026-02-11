import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already exists", 400));
    }

    const user = await User.create({ name, email, password });

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      token
    });

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      token
    });

  } catch (error) {
    next(error);
  }
};
