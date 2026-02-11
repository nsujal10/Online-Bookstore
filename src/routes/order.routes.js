import express from "express";
import {
  placeOrder,
  getOrders,
  cancelOrder
} from "../controllers/order.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order Management APIs (Transactional)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         book:
 *           $ref: '#/components/schemas/Book'
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 499
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1abc12345xyz
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           example: 998
 *         status:
 *           type: string
 *           enum: [PLACED, SHIPPED, DELIVERED, CANCELLED]
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Place a new order (Uses MongoDB transaction)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       This endpoint:
 *       - Validates cart
 *       - Checks stock
 *       - Deducts stock
 *       - Creates order
 *       - Clears cart
 *       - Uses MongoDB transaction (Atomic)
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart empty or stock issue
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get authenticated user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order (Only if status is PLACED)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Cannot cancel shipped/delivered order
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */



router.post("/", placeOrder);
router.get("/", getOrders);
router.patch("/:id/cancel", cancelOrder);

export default router;
