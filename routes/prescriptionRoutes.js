// Create routes/prescriptionRoutes.js
const express = require("express");
const Prescription = require("../models/Prescription");
const prescriptionRouter = express.Router();

/**
 * @swagger
 * /api/prescriptions/add:
 *   post:
 *     summary: Add a prescription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptom_id:
 *                 type: integer
 *               doctor_id:
 *                 type: integer
 *               medicine:
 *                 type: string
 *               dosage:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prescription added successfully
 */
prescriptionRouter.post("/add", (req, res) => {
    Prescription.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Prescription added successfully" });
    });
});

/**
 * @swagger
 * /api/prescriptions/symptom/{id}:
 *   get:
 *     summary: Get prescriptions by symptom ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
prescriptionRouter.get("/symptom/:id", (req, res) => {
    Prescription.getBySymptom(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

/**
 * @swagger
 * /api/prescriptions/update/{id}:
 *   put:
 *     summary: Update a prescription
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
 *             schema:
 *               type: object
 *               properties:
 *                 patient_id:
 *                   type: integer
 *                 doctor_id:
 *                   type: integer
 *                 medicine:
 *                   type: string
 *                 dosage:
 *                   type: string
 *                 notes:
 *                   type: string
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *       404:
 *         description: Prescription not found
 */
prescriptionRouter.put("/update/:id", (req, res) => {
    const prescription_id = req.params.id;
    const updatedData = req.body;

    Prescription.update(prescription_id, updatedData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        res.status(200).json({ message: "Prescription updated successfully" });
    });
});

/**
 * @swagger
 * /api/prescriptions/delete/{id}:
 *   delete:
 *     summary: Delete a prescription by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 *       404:
 *         description: Prescription not found
 */
prescriptionRouter.delete("/delete/:id", (req, res) => {
    const prescription_id = req.params.id;

    Prescription.delete(prescription_id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        res.status(200).json({ message: "Prescription deleted successfully" });
    });
});

/**
 * @swagger
 * /api/prescriptions/patient/{patient_id}:
 *   get:
 *     summary: Get prescriptions by patient ID
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
prescriptionRouter.get("/patient/:patient_id", (req, res) => {
    Prescription.getPrescriptionByPatient(req.params.patient_id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = prescriptionRouter;