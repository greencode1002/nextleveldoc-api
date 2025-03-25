const db = require("../config/db");

const PatientSymptom = {
    create: (symptom, callback) => {
        const sql = "INSERT INTO patients_symptoms (patient_id, age, symptoms, nurse_id) VALUES (?, ?, ?, ?)";
        db.query(sql, [symptom.patient_id, symptom.age, symptom.symptoms, symptom.nurse_id], callback);
    },
    updateSymptom: (symptom, callback) => {
        const sql = `
            UPDATE patients_symptoms 
            SET patient_id = ?, age = ?, symptoms = ?, nurse_id = ? 
            WHERE symptom_id = ?;
        `;
        db.query(sql, [
            symptom.patient_id,
            symptom.age,
            symptom.symptoms,
            symptom.nurse_id,
            symptom.symptom_id
        ], callback);
    },
    deleteSymptom: (symptom_id, callback) => {
        const sql = "DELETE FROM patients_symptoms WHERE symptom_id = ?";
        db.query(sql, [symptom_id], callback);
    },
    getAll: (callback) => {
        const sql = "SELECT * FROM patients_symptoms";
        db.query(sql, callback);
    },
    getPatientsWithPrescriptions: (callback) => {
        const sql = "SELECT ps.* FROM `patients_symptoms` ps, prescriptions p WHERE p.symptom_id = ps.symptom_id";
        db.query(sql, callback);
    },
    getPatientsWithoutPrescriptions: (callback) => {
        const sql = "SELECT ps.* FROM `patients_symptoms` ps, prescriptions p WHERE p.symptom_id = ps.symptom_id";
        db.query(sql, callback);
    },
};

module.exports = PatientSymptom;
