const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));


// temp student data
// let students = [
//     {
//         ID: 1,
//         studentNumber: "2026-0001",
//         firstName: "Enrico Miguel",
//         lastName: "Orteza",
//         birthDate: "2006-01-24",
//         course: "BSCS",
//         yearLevel: 3,
//         status: "active"
//     }
// ];

// let nextID = 2;


// 1. display students : GET /api/students
app.get('/api/students', async (req, res) => {
    try {
        const [students] = await pool.query(
            'SELECT * FROM students ORDER BY ID ASC'
        );

        res.status(200).json(students);

    } catch (error) {
        console.error('Error fetching students:', error);

        res.status(500).json({
            message: "Failed to retrieve student records"
        });
    }
});


// 2. add student : POST /api/students
app.post('/api/students', async (req, res) => {

    const {
        studentNumber,
        firstName,
        lastName,
        birthDate,
        course,
        yearLevel,
        status
    } = req.body;

    // validate required fields
    if (
        !studentNumber ||
        !firstName ||
        !lastName ||
        !birthDate ||
        !course ||
        yearLevel === undefined ||
        yearLevel === null ||
        yearLevel === ''
    ) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    // validate year level
    if (
        !Number.isInteger(Number(yearLevel)) ||
        Number(yearLevel) < 1 ||
        Number(yearLevel) > 4
    ) {
        return res.status(400).json({
            message: "Year level must be between 1 and 4"
        });
    }

    // validate status
    const studentStatus = status || "active";
    if (!["active", "inactive"].includes(studentStatus)) {
        return res.status(400).json({
            message: "Status must be active or inactive"
        });
    }

    try {
        // Insert student record into MySQL
        const [result] = await pool.query(
            `INSERT INTO students
            (studentNumber, firstName, lastName, birthDate, course, yearLevel, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                studentNumber,
                firstName,
                lastName,
                birthDate,
                course,
                Number(yearLevel),
                studentStatus
            ]
        );

        // Retrieve the newly inserted student
        const [newStudent] = await pool.query(
            'SELECT * FROM students WHERE ID = ?',
            [result.insertId]
        );

        // res.status(201).json(newStudent);
        res.status(201).json(newStudent[0]);

    } catch (error) {
        console.error('Error adding student:', error);

        // Handle duplicate student number
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: "Student number already exists"
            });
        }

        res.status(500).json({
            message: "Failed to add student"
        });
    }
});


// 3. update student : PUT /api/students/:id
app.put('/api/students/:id', async (req, res) => {

    const studentID = Number(req.params.id);

    if (!Number.isInteger(studentID) || studentID <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const {
        studentNumber,
        firstName,
        lastName,
        birthDate,
        course,
        yearLevel,
        status
    } = req.body;

    if (
        !studentNumber ||
        !firstName ||
        !lastName ||
        !birthDate ||
        !course ||
        yearLevel === undefined ||
        yearLevel === null ||
        yearLevel === ''
    ) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    if (
        !Number.isInteger(Number(yearLevel)) ||
        Number(yearLevel) < 1 ||
        Number(yearLevel) > 4
    ) {
        return res.status(400).json({
            message: "Year level must be between 1 and 4"
        });
    }

    const studentStatus = status || "active";

    if (!["active", "inactive"].includes(studentStatus)) {
        return res.status(400).json({
            message: "Status must be active or inactive"
        });
    }

    try {
        // Check if student exists
        const [existingStudent] = await pool.query(
            'SELECT ID FROM students WHERE ID = ?',
            [studentID]
        );

        if (existingStudent.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Update student record
        await pool.query(
            `UPDATE students
             SET studentNumber = ?,
                 firstName = ?,
                 lastName = ?,
                 birthDate = ?,
                 course = ?,
                 yearLevel = ?,
                 status = ?
             WHERE ID = ?`,
            [
                studentNumber,
                firstName,
                lastName,
                birthDate,
                course,
                Number(yearLevel),
                studentStatus,
                studentID
            ]
        );

        // Retrieve updated student
        const [updatedStudent] = await pool.query(
            'SELECT * FROM students WHERE ID = ?',
            [studentID]
        );

        res.status(200).json(updatedStudent[0]);

    } catch (error) {
        console.error('Error updating student:', error);

        // Handle duplicate student number
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: "Student number already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update student"
        });
    }
});


// 4. delete student : DELETE /api/students/:id
app.delete('/api/students/:id', async (req, res) => {

    const studentID = Number(req.params.id);

    if (!Number.isInteger(studentID) || studentID <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    try {
        // Delete student record
        const [result] = await pool.query(
            'DELETE FROM students WHERE ID = ?',
            [studentID]
        );

        // Check if student exists
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting student:', error);

        res.status(500).json({
            message: "Failed to delete student"
        });
    }
});


// 5. search student : GET /api/students/search?q=keyword
app.get('/api/students/search', async (req, res) => {

    const keyword = req.query.q;

    if (typeof keyword !== 'string' || !keyword.trim()) {
        return res.status(400).json({
            message: "Please provide a search keyword"
        });
    }

    const searchTerm = `%${keyword.trim()}%`;

    try {
        // Search student records
        const [results] = await pool.query(
            `SELECT * FROM students
             WHERE studentNumber LIKE ?
                OR firstName LIKE ?
                OR lastName LIKE ?
                OR course LIKE ?
             ORDER BY ID ASC`,
            [
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm
            ]
        );

        res.status(200).json(results);

    } catch (error) {
        console.error('Error searching students:', error);

        res.status(500).json({
            message: "Failed to search student records"
        });
    }
});


// 6. DASHBOARD STATISTICS : GET /api/students/dashboard
app.get('/api/students/dashboard', async (req, res) => {

    try {
        const [rows] = await pool.query(
            `SELECT
                COUNT(*) AS totalStudents,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeStudents,
                SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactiveStudents
             FROM students`
        );

        res.status(200).json({
            totalStudents: rows[0].totalStudents,
            activeStudents: rows[0].activeStudents,
            inactiveStudents: rows[0].inactiveStudents
        });

    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);

        res.status(500).json({
            message: "Failed to retrieve dashboard statistics"
        });
    }
});


// TEST API : GET /api
app.get('/api', (req, res) => {
    res.status(200).json({
        message: "Student Information System API is running!"
    });
});


// start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
