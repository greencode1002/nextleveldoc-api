const express = require("express");
const Patient = require("../models/Patient");
const patientRouter = express.Router();

/**
 * @swagger
 * /api/patient/patienthistory/{patient_id}:
 *   get:
 *     summary: Get all patient history by ID
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of patient history
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: No Patient History found
 */
patientRouter.get("/patienthistory/:patient_id", (req, res) => {
    const id = req?.params?.patient_id;
    Patient.getPatientHistory(id, async (err, results) => {
        if (err) return res.status(500).json({ error: "No Patient History found" });
        if (!results || results?.length == 0)
            return res.status(404).json({ error: "No Patient History found" });
        res.json(results);
    });
});

module.exports = patientRouter;
