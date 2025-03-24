// Create routes/patientRoutes.js
const express = require("express");
const Transaction = require("../models/Transaction");
const transactionsRouter = express.Router();

/**
 * @swagger
 * /api/transactions/add:
 *   post:
 *     summary: Add a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               amount:
 *                 type: integer
 *               payment_status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Transaction added successfully
 */
transactionsRouter.post("/add", (req, res) => {
    Transaction.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Transaction added successfully" });
    });
});

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: List of transactions
 */
transactionsRouter.get("/", (req, res) => {
    Transaction.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = transactionsRouter;