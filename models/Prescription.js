const db = require("../config/db");

const Prescription = {
    create: (prescription, callback) => {
        console.log('prescription', prescription);
        const sql = "INSERT INTO prescriptions (symptom_id, doctor_id, medicine, dosage, notes) VALUES (?, ?, ?, ?, ?)";

        db.query(sql, [
            prescription.symptom_id,
            prescription.doctor_id,
            prescription.medicine,
            prescription.dosage,
            prescription.notes
        ], (err, result) => {
            if (err) return callback(err);

            // Update patients_symptoms to set is_prescribed = true
            const updateSql = "UPDATE patients_symptoms SET is_prescribed = true WHERE symptom_id = ?";
            db.query(updateSql, [prescription.symptom_id], (updateErr) => {
                if (updateErr) return callback(updateErr);
                callback(null, result);
            });
        });
    },

    getBySymptom: (symptom_id, callback) => {
        const sql = "SELECT * FROM prescriptions WHERE symptom_id = ?";
        db.query(sql, [symptom_id], callback);
    },

    getPrescriptionByPatient: (patient_id, callback) => {
        // Step 1: Get all symptom_ids for the patient
        const sqlSymptoms = "SELECT symptom_id FROM patients_symptoms WHERE patient_id = ?";

        db.query(sqlSymptoms, [patient_id], (err, symptomResults) => {
            if (err) return callback(err);

            // Step 2: Check if any symptom_id found
            if (symptomResults.length === 0) {
                return callback(null, []);  // No symptoms found for the patient
            }

            // Step 3: Extract symptom_ids from the result
            const symptomIds = symptomResults.map(row => row.symptom_id);

            // Step 4: Use the symptom_ids to query the prescriptions
            const sqlPrescriptions = "SELECT * FROM prescriptions WHERE symptom_id IN (?)";
            db.query(sqlPrescriptions, [symptomIds], callback);
        });
    },
    // Update a prescription by ID
    update: (prescription_id, updatedData, callback) => {
        const { symptom_id, doctor_id, medicine, dosage, notes } = updatedData;
        const sql = `
            UPDATE prescriptions 
            SET symptom_id = ?, doctor_id = ?, medicine = ?, dosage = ?, notes = ?
            WHERE id = ?
        `;
        db.query(sql, [symptom_id, doctor_id, medicine, dosage, notes, prescription_id], callback);
    },

    // Delete a prescription by ID
    delete: (prescription_id, callback) => {
        const sql = "DELETE FROM prescriptions WHERE id = ?";
        db.query(sql, [prescription_id], callback);
    }
};

module.exports = Prescription;
