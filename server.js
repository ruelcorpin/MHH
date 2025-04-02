const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Import bcrypt

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "signup_data.txt");
const SALT_ROUNDS = 10; // Security level for bcrypt
const filePath = path.join("/data", "signup_data.txt");


// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, icon)
app.use(express.static(__dirname));

// Function to check if an email already exists
function emailExists(email, callback) {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                return callback(false); // File doesn't exist, so email can't exist
            }
            console.error("Error reading file:", err);
            return callback(false);
        }
        const emailPattern = new RegExp(`Email: ${email}`, "i"); // Case-insensitive search
        callback(emailPattern.test(data));
    });
}

// Handle signup form submission
app.post("/signup", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    console.log("Received Data:", req.body); // Debugging: Check received data

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if email already exists
    emailExists(email, (exists) => {
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        // Encrypt the password before saving
        bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ success: false, message: "Error processing signup." });
            }

            // Append user data with hashed password
            const data = `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPassword: ${hashedPassword}\n----------------------\n`;

            fs.appendFile(DATA_FILE, data, (err) => {
                if (err) {
                    console.error("Error saving data:", err);
                    return res.status(500).json({ success: false, message: "Error saving data." });
                }
                res.json({ success: true, message: "Signup Successful!" });
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
