
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));


// temp student data
let students = [
    {
        ID: 1,
        studentNumber: "2026-0001",
        firstName: "Enrico Miguel",
        lastName: "Orteza",
        birthDate: "2006-01-24",
        course: "BSCS",
        yearLevel: 3,
        status: "active"
    }
];

let nextID = 2;


// 1. display students : GET /api/students
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});


// 2. add student : POST /api/students
app.post('/api/students', (req, res) => {

    const {
        studentNumber,
        firstName,
        lastName,
        birthDate,
        course,
        yearLevel,
        status
    } = req.body;

    // Check required fields
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

    // Check year level
    if (
        !Number.isInteger(Number(yearLevel)) ||
        Number(yearLevel) < 1 ||
        Number(yearLevel) > 4
    ) {
        return res.status(400).json({
            message: "Year level must be between 1 and 4"
        });
    }

    // Check status
    const studentStatus = status || "active";

    if (!["active", "inactive"].includes(studentStatus)) {
        return res.status(400).json({
            message: "Status must be active or inactive"
        });
    }

    // Check duplicate student number
    const duplicate = students.some(
        student => student.studentNumber === studentNumber
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Student number already exists"
        });
    }

    // Create new student
    const newStudent = {
        ID: nextID++,
        studentNumber,
        firstName,
        lastName,
        birthDate,
        course,
        yearLevel: Number(yearLevel),
        status: studentStatus
    };

    students.push(newStudent);

    res.status(201).json([newStudent]);
});


// 3. update student : PUT /api/students/:id
app.put('/api/students/:id', (req, res) => {

    const studentID = Number(req.params.id);

    const student = students.find(
        student => student.ID === studentID
    );

    if (!Number.isInteger(studentID) || studentID <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
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

    // Check duplicate student number
    const duplicate = students.some(
        existing =>
            existing.studentNumber === studentNumber &&
            existing.ID !== studentID
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Student number already exists"
        });
    }

    // Update student
    Object.assign(student, {
        studentNumber,
        firstName,
        lastName,
        birthDate,
        course,
        yearLevel: Number(yearLevel),
        status: studentStatus
    });

    res.status(200).json(student);
});


// 4. delete student : DELETE /api/students/:id
app.delete('/api/students/:id', (req, res) => {

    const studentID = Number(req.params.id);

    if (!Number.isInteger(studentID) || studentID <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const studentIndex = students.findIndex(
        student => student.ID === studentID
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(studentIndex, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});

// 5. search student : GET /api/students/search?q=keyword
app.get('/api/students/search', (req, res) => {

    const keyword = req.query.q;

    if (!keyword || !keyword.trim()) {
        return res.status(400).json({
            message: "Please provide a search keyword"
        });
    }

    const searchTerm = keyword.trim().toLowerCase();

    const results = students.filter(student =>
        student.studentNumber.toLowerCase().includes(searchTerm) ||
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm)
    );

    res.status(200).json(results);
});


// 6. DASHBOARD STATISTICS : GET /api/students/dashboard
app.get('/api/students/dashboard', (req, res) => {

    const totalStudents = students.length;

    const activeStudents = students.filter(
        student => student.status === "active"
    ).length;

    const inactiveStudents = students.filter(
        student => student.status === "inactive"
    ).length;

    res.status(200).json({
        totalStudents,
        activeStudents,
        inactiveStudents
    });
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
