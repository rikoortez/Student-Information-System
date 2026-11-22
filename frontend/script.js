// API base URL
const API_URL = '/api/students';

// Load all student records
async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to load student records');
        }

        const students = await response.json();

        displayStudents(students);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Display students inside the HTML table
function displayStudents(students) {

    const tableBody = document.getElementById('studentTableBody');

    // Clear existing table contents
    tableBody.innerHTML = '';

    // Loop through each student
    students.forEach(student => {

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${student.ID}</td>
            <td>${student.studentNumber}</td>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.birthDate}</td>
            <td>${student.course}</td>
            <td>${student.yearLevel}</td>
            <td>${student.status}</td>
            <td>Actions coming soon</td>
        `;

        tableBody.appendChild(row);
    });
}

// Load students when the page opens
document.addEventListener('DOMContentLoaded', loadStudents);
