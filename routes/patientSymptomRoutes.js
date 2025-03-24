// routes/patientRoutes.js
const express = require("express");
const PatientSymptom = require("../models/PatientSymptom");
const patientSymptomRouter = express.Router();

/**
 * @swagger
 * /api/patientsymptoms/add:
 *   post:
 *     summary: Add a new patient symptom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               age:
 *                 type: integer
 *               symptoms:
 *                 type: string
 *               nurse_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Patient symptom added successfully
 */
patientSymptomRouter.post("/add", (req, res) => {
    PatientSymptom.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Patient symptom added successfully" });
    });
});

/**
 * @swagger
 * /api/patientsymptoms:
 *   get:
 *     summary: Get all patient symptoms
 *     responses:
 *       200:
 *         description: List of patient symptoms
 */
patientSymptomRouter.get("/", (req, res) => {
    PatientSymptom.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

/**
 * @swagger
 * /api/patientsymptoms/update/{symptom_id}:
 *   put:
 *     summary: Update patient symptoms
 *     parameters:
 *       - in: path
 *         name: symptom_id
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
 *               patient_id:
 *                 type: integer   
 *               age:
 *                 type: integer
 *               symptoms:
 *                 type: string
 *               nurse_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Patient symptoms updated successfully
 */
patientSymptomRouter.put("/update/:symptom_id", (req, res) => {
    let symptom_id = req?.params?.symptom_id;
    symptom_id = parseInt(symptom_id);
    const { patient_id, age, symptoms, nurse_id } = req.body;
    PatientSymptom.updateSymptom({ symptom_id, patient_id, age, symptoms, nurse_id }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Patient symptoms updated successfully" });
    });
});

/**
 * @swagger
 * /api/patientsymptoms/delete/{symptom_id}:
 *   delete:
 *     summary: Delete a patient symptom
 *     parameters:
 *       - in: path
 *         name: symptom_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient symptom deleted successfully
 */
patientSymptomRouter.delete("/delete/:symptom_id", (req, res) => {
    const { symptom_id } = req.params;
    PatientSymptom.deleteSymptom(symptom_id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Patient symptom deleted successfully" });
    });
});

module.exports = patientSymptomRouter;
