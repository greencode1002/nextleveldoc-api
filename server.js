const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const patientSymptomRoutes = require("./routes/patientSymptomRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const transactionsRoutes = require("./routes/transactionsRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hospital Management API",
            version: "1.0.0",
            description: "API for managing hospital operations",
        },
        servers: [{ url: "http://localhost:9000" }],
        components: {  // Add this part
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        "./routes/userRoutes.js",
        "./routes/patientSymptomRoutes.js",
        "./routes/prescriptionRoutes.js",
        "./routes/transactionsRoutes.js"
    ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/users", userRoutes);
app.use("/api/patientsymptoms", patientSymptomRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/transactions", transactionsRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));