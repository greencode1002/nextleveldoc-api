// Create routes/patientRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
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
 *               symptom_id:
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

/**
 * @swagger
 * /api/transactions/download/{symptom_id}:
 *   get:
 *     summary: Download prescription as PDF
 *     parameters:
 *       - in: path
 *         name: symptom_id
 *         required: true
 *         description: Symptom ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF downloaded
 */
transactionsRouter.get("/download/:symptom_id", (req, res) => {
    const symptom_id = req?.params?.symptom_id;

    Transaction.getTransactionById(symptom_id, async (err, transaction) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!transaction)
            return res.status(404).json({ error: "No Prescription found" });

        // Helper function to handle undefined values
        const safeText = (value) => (value ? value.toString() : "N/A");

        // Split medicines, dosages, and notes into arrays
        const medicines = safeText(transaction.medicine).split(",");
        const dosages = safeText(transaction.dosage).split(",");
        const instructions = safeText(transaction.notes).split(",");

        // Create PDF
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const filePath = path.join(__dirname, "../prescriptions", `prescription_${symptom_id}.pdf`);
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add Logo
        const pageWidth = doc.page.width;
        const imageWidth = 160; // Adjust this based on your logo size
        const centerX = (pageWidth - imageWidth) / 2;

        const logoPath = path.join(__dirname, "../images/logo.png");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, centerX, doc.y, { width: imageWidth });
            doc.moveDown(5);
        } else {
            console.warn("Logo file not found:", logoPath);
        }

        // Title
        doc
            .fontSize(22)
            .fillColor("#1a73e8")
            .text("Rx Prescription", { align: "center" })
            .moveDown(1);

        // Patient Information
        doc
            .fontSize(12)
            .fillColor("black")
            .text(`Patient Name: ${safeText(transaction.patient_firstname)} ${safeText(transaction.patient_lastname)}`)
            .text(`Age: ${safeText(transaction.age)}`)
            .text(`Symptoms: ${safeText(transaction.symptoms)}`)
            .text(`Email: ${safeText(transaction.patient_email)}`)
            .text(`Date: ${new Date(transaction.created_at).toLocaleDateString()}`)
            .moveDown(1);

        // Prescription Table Header
        doc
            .fontSize(14)
            .fillColor("#1a73e8")
            .text("Prescription Details", { underline: true })
            .moveDown(0.5);

        // Table Header
        const tableTop = doc.y;
        const col1Width = 180;
        const col2Width = 180;
        const col3Width = 180;
        const startX = 50;

        // Draw the table header with borders
        doc
            .fontSize(12)
            .fillColor("black")
            .text("Medicine", startX, tableTop, { width: col1Width, align: "left" })
            .text("Dosage", startX + col1Width, tableTop, { width: col2Width, align: "left" })
            .text("Instructions", startX + col1Width + col2Width, tableTop, { width: col3Width, align: "left" });

        // Draw table header border
        doc.moveTo(startX, doc.y)
            .lineTo(startX + col1Width + col2Width + col3Width, doc.y)
            .stroke();

        // Draw a vertical border between columns
        // doc.moveTo(startX + col1Width, tableTop)
        //     .lineTo(startX + col1Width, doc.y)
        //     .stroke();

        // doc.moveTo(startX + col1Width + col2Width, tableTop)
        //     .lineTo(startX + col1Width + col2Width, doc.y)
        //     .stroke();

        // Draw a horizontal border for the first row
        doc.moveTo(startX, doc.y)
            .lineTo(startX + col1Width + col2Width + col3Width, doc.y)
            .stroke()
            .moveDown(0.5);

        // Add each medicine, dosage, and instruction to the table
        medicines.forEach((med, index) => {
            doc
                .fontSize(12)
                .fillColor("black")
                .text(safeText(med), startX, doc.y, { width: col1Width, align: "left" })
                .text(safeText(dosages[index] || "-"), startX + col1Width, doc.y, { width: col2Width, align: "left" })
                .text(safeText(instructions[index] || "-"), startX + col1Width + col2Width, doc.y, { width: col3Width, align: "left" });

            // Draw borders for the row
            doc.moveTo(startX, doc.y)
                .lineTo(startX + col1Width, doc.y)
                .stroke();

            doc.moveTo(startX + col1Width, doc.y)
                .lineTo(startX + col1Width + col2Width, doc.y)
                .stroke();

            doc.moveTo(startX + col1Width + col2Width, doc.y)
                .lineTo(startX + col1Width + col2Width + col3Width, doc.y)
                .stroke();

            // Draw a horizontal line at the end of each row
            doc.moveTo(startX, doc.y)
                .lineTo(startX + col1Width + col2Width + col3Width, doc.y)
                .stroke()
                .moveDown(0.5);
        });

        // Total Amount
        doc
            .fontSize(14)
            .fillColor("#1a73e8")
            .text("Total Amount Paid", { underline: true })
            .moveDown(0.5);

        doc
            .fontSize(12)
            .fillColor("black")
            .text(`CAD ${safeText(Number(transaction.amount))}`, { align: "left" })
            .moveDown(1);

        // Payment Status
        // doc
        //     .fontSize(12)
        //     .fillColor("black")
        //     .text(`Payment Status: ${transaction.payment_status === 1 ? "Paid" : "Unpaid"}`, { align: "left" })
        //     .moveDown(1);

        // Footer
        // Move to bottom of the page
        doc.y = doc.page.height - 90;

        doc
            .fillColor("#888")
            .fontSize(13)
            .text("This is a system-generated prescription.", doc.page.width / 2 - 100, doc.y, {
                width: 200,
                align: "center",
            });

        doc.end();

        stream.on("finish", () => {
            res.download(filePath, `prescription_${symptom_id}.pdf`, (err) => {
                if (err) console.error(err);
                fs.unlinkSync(filePath); // Delete file after download
            });
        });
    });
});

module.exports = transactionsRouter;