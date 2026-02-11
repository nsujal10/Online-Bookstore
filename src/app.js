import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import { protect, authorize } from "./middlewares/auth.middleware.js";
import bookRoutes from "./routes/book.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";




const app = express();

app.get("/api/v1/admin-test", protect, authorize("ADMIN"), (req, res) => {
  res.json({ message: "Admin route working" });
});

// Security headers
app.use(helmet());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// CORS
app.use(cors());

// Logging
app.use(morgan("dev"));

// Body parser
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working");
});

// Routes
app.use("/api/v1/auth", authRoutes);

// Error handler
app.use(errorHandler);

app.use("/api/v1/books", bookRoutes);

app.use("/api/v1/cart", cartRoutes);


app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/books/:bookId/reviews", reviewRoutes);




app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export default app;
