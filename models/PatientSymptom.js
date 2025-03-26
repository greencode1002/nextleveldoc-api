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
        const sql = "SELECT CONCAT(u.firstname,' ', u.lastname) as patient_name, ps.* FROM patients_symptoms ps, users u where u.id = ps.patient_id";
        db.query(sql, callback);
    },
};

module.exports = PatientSymptom;
