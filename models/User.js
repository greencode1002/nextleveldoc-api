const db = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
    create: async (user, callback) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const sql = "INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [user.firstname, user.lastname, user.email, hashedPassword, user.role], callback);
    },
    update: async (user, callback) => {
        const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : null;
        let sql = `UPDATE users SET firstname = ?, lastname = ?, email = ?, role = ?`;
        const params = [user.firstname, user.lastname, user.email, user.role];

        if (hashedPassword) {
            sql += `, password = ?`;
            params.push(hashedPassword);
        }

        sql += ` WHERE id = ?`;
        params.push(user.id);

        db.query(sql, params, callback);
    },

    findByEmail: (email, callback) => {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], callback);
    },

    getAllUsers: (callback) => {
        const sql = "SELECT * FROM users";
        db.query(sql, callback);
    },

    getUsersByRole: (role, callback) => {
        const sql = "SELECT * FROM users WHERE role = ?";
        db.query(sql, [role], callback);
    },

    deleteUser: (id, callback) => {
        const sql = "DELETE FROM users WHERE id = ?";
        db.query(sql, [id], callback);
    },
};

module.exports = User;
