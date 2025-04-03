const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = (req, res) => {
    const { firstname, lastname, email, password, role } = req.body;
    User.create({ firstname, lastname, email, password, role }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered successfully" });
    });
};

exports.updateUser = (req, res) => {
    const { firstname, lastname, email, password, role } = req.body;
    const { id } = req?.params;
    User.update({ id, firstname, lastname, email, password, role }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered successfully" });
    });
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    });
};


exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ users: results });
    });
};

exports.getUsersByRole = (req, res) => {
    const { role } = req.params;
    User.getUsersByRole(role, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: `No users found with the role ${role}` });
        res.status(200).json({ users: results });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    User.deleteUser(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted successfully" });
    });
};
