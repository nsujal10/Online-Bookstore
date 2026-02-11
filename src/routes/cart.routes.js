import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);


/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         book:
 *           type: string
 *           example: 64f1abc12345xyz
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     Cart:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           example: 64f1abc12345xyz
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               book:
 *                 $ref: '#/components/schemas/Book'
 *               quantity:
 *                 type: integer
 */

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/cart:
 *   post:
 *     summary: Add book to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: 64f1abc12345xyz
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Book added to cart successfully
 *       400:
 *         description: Invalid quantity or stock issue
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/cart/{bookId}:
 *   delete:
 *     summary: Remove book from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to remove
 *     responses:
 *       200:
 *         description: Book removed from cart successfully
 *       404:
 *         description: Cart or book not found
 *       401:
 *         description: Unauthorized
 */



router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:bookId", removeFromCart);

export default router;
