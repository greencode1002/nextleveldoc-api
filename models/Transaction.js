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

                // Check if patient_id exists in prescriptions
                const checkSql = "SELECT COUNT(*) AS count FROM prescriptions WHERE patient_id = ?";
                connection.query(checkSql, [transactionData.patient_id], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(err);
                        });
                    }

                    if (results[0].count === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(new Error("Patient ID does not exist in prescriptions table"));
                        });
                    }

                    // Insert transaction
                    const insertSql = "INSERT INTO payment_transactions (patient_id, amount, payment_status) VALUES (?, ?, ?)";
                    connection.query(insertSql, [transactionData.patient_id, transactionData.amount, transactionData.payment_status], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err);
                            });
                        }

                        // Update prescriptions table
                        const updateSql = "UPDATE prescriptions SET is_payment_completed = 1 WHERE patient_id = ?";
                        connection.query(updateSql, [transactionData.patient_id], (err, result) => {
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

    getAll: (callback) => {
        const sql = "SELECT * FROM payment_transactions";
        db.query(sql, callback);
    }
};

module.exports = Transaction;
