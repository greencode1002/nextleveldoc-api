// Create routes/userRoutes.js
const express = require("express");
const User = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const userRouter = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["doctor", "nurse", "patient"]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
userRouter.post("/register", User.register);

/**
 * @swagger
 * /api/users/updateuser/{id}:
 *   post:
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["doctor", "nurse", "patient"]
 *     responses:
 *       201:
 *         description: User updated successfully
 */
userRouter.put("/updateuser/:id", User.updateUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 */
userRouter.post("/login", User.login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get("/", User.getAllUsers);

/**
 * @swagger
 * /api/users/role/{role}:
 *   get:
 *     summary: Get users by role
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         description: The role of the user (e.g., doctor, nurse, patient)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users with the specified role
 */
userRouter.get("/role/:role", User.getUsersByRole);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
userRouter.delete("/delete/:id", User.deleteUser);

module.exports = userRouter;