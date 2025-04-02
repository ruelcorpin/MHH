const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

// ✅ Define file path in /data (Render persistent storage)
const DATA_DIR = "/data";
const DATA_FILE = path.join(DATA_DIR, "signup_data.txt");

// ✅ Ensure /data directory exists (important for Render disk)
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// ✅ Function to check if email already exists in signup_data.txt
function emailExists(email, callback) {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") return callback(false); // File doesn't exist yet
            console.error("Error reading file:", err);
            return callback(false);
        }
        const emailPattern = new RegExp(`^Email: ${email}$`, "m"); // Match exact email
        callback(emailPattern.test(data));
    });
}

// ✅ Handle signup request
app.post("/signup", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    console.log("Received Data:", req.body);

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    emailExists(email, (exists) => {
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ success: false, message: "Error processing signup." });
            }

            const userData = `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPassword: ${hashedPassword}\n----------------------\n`;

            fs.appendFile(DATA_FILE, userData, (err) => {
                if (err) {
                    console.error("Error saving data:", err);
                    return res.status(500).json({ success: false, message: "Error saving data." });
                }
                res.json({ success: true, message: "Signup Successful!" });
            });
        });
    });
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
