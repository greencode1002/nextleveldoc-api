const db = require("../config/db");

const Patient = {
    getPatientHistory: (id, callback) => {
        const sql = `SELECT u.firstname, u.lastname,u.email, ps.symptom_id, 
        ps.patient_id, ps.age, ps.nurse_id, ps.is_prescribed, 
        p.medicine,p.dosage,p.notes,p.is_payment_completed 
        FROM users u left join patients_symptoms ps 
        ON u.id = ps.patient_id left outer join prescriptions p 
        ON ps.symptom_id = p.symptom_id where u.id = ?`;
        db.query(sql, [id], callback);
    },
};

module.exports = Patient;
