const db = require("../config/db");

const Transaction = {
    create: (transactionData, callback) => {
        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return callback(err);
                }

                // Check if symptom_id exists in prescriptions
                const checkSql = "SELECT COUNT(*) AS count FROM prescriptions WHERE symptom_id = ?";
                connection.query(checkSql, [transactionData.symptom_id], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(err);
                        });
                    }

                    if (results[0].count === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(new Error("Symptom ID does not exist in prescriptions table"));
                        });
                    }

                    // Insert transaction
                    const insertSql = "INSERT INTO payment_transactions (patient_id, symptom_id, amount, payment_status) VALUES (?, ?, ?, ?)";
                    connection.query(insertSql, [
                        transactionData.patient_id,
                        transactionData.symptom_id,
                        transactionData.amount,
                        transactionData.payment_status
                    ], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err);
                            });
                        }

                        // Update prescriptions table
                        const updateSql = "UPDATE prescriptions SET is_payment_completed = 1 WHERE symptom_id = ?";
                        connection.query(updateSql, [transactionData.symptom_id], (err, result) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(err);
                                });
                            }

                            // Commit transaction
                            connection.commit(err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(err);
                                    });
                                }
                                connection.release();
                                callback(null, { message: "Transaction completed successfully" });
                            });
                        });
                    });
                });
            });
        });
    },

    getTransactionById: (id, callback) => {
        const sql = `SELECT pt.amount, pt.created_at, pt.transaction_id, 
        pt.payment_status, p.medicine,p.dosage, p.notes, 
        ps.age,ps.symptoms, u.firstname as patient_firstname, 
        u.lastname as patient_lastname, u.email as patient_email 
        FROM prescriptions p, patients_symptoms ps, 
        users u, payment_transactions pt WHERE p.symptom_id = ps.symptom_id 
        and pt.symptom_id = p.symptom_id and pt.patient_id = u.id 
        and ps.symptom_id = ${id}`;
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]); // Return first result
        });
    },

    getAll: (callback) => {
        const sql = "SELECT * FROM payment_transactions";
        db.query(sql, callback);
    }
};

module.exports = Transaction;
