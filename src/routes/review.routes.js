import express from "express";
import { addReview, getReviews } from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book Review & Rating Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1abc12345xyz
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Sujal
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           example: Amazing book!
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/books/{bookId}/reviews:
 *   get:
 *     summary: Get all reviews for a specific book
 *     tags: [Reviews]
 *     description: |
 *       Supports:
 *       - Pagination
 *       - Sorting (latest, highest rating)
 *       - Returns total review count
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of reviews per page (default 5)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, highest]
 *         description: Sort reviews by latest or highest rating
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalReviews:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: Book not found
 */

/**
 * @swagger
 * /api/v1/books/{bookId}/reviews:
 *   post:
 *     summary: Add review for a book (Purchased users only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Rules:
 *       - User must be authenticated
 *       - User must have purchased the book
 *       - One review per user per book
 *       - Rating must be between 1 and 5
 *       - Automatically recalculates book average rating
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent book with great explanations.
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Duplicate review or validation error
 *       403:
 *         description: User has not purchased this book
 *       401:
 *         description: Unauthorized
 */



router.get("/", getReviews);
router.post("/", protect, addReview);

export default router;
