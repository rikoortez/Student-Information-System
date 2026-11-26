// API base URL
const API_URL = '/api/students';

// Store currently displayed student records
let currentStudents = [];

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

    // Track currently displayed records
    currentStudents = students;

    // Loop through each student
    students.forEach(student => {

        const row = document.createElement('tr');

        // Create table cells
        const values = [
            student.ID,
            student.studentNumber,
            student.firstName,
            student.lastName,
            student.birthDate,
            student.course,
            student.yearLevel,
            student.status
        ];

        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Edit and Delete buttons
        const actionCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', () => {
            editStudent(student.ID);
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', () => {
            deleteStudent(student.ID);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// Handle adding and updating student records
async function saveStudent(event) {

    event.preventDefault();

    const studentID = document.getElementById('studentId').value;

    const studentData = {
        studentNumber: document.getElementById('studentNumber').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        birthDate: document.getElementById('birthDate').value,
        course: document.getElementById('course').value.trim(),
        yearLevel: Number(document.getElementById('yearLevel').value),
        status: document.getElementById('status').value
    };

    // Determine whether to add or update a student
    const isEditing = studentID !== '';

    const url = isEditing
        ? `${API_URL}/${studentID}`
        : API_URL;

    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to save student');
        }

        alert(
            isEditing
                ? 'Student updated successfully!'
                : 'Student added successfully!'
        );

        // Reset form after saving
        clearForm();

        // Refresh student table
        await loadStudents();

    } catch (error) {
        console.error('Error saving student:', error);
        alert(error.message);
    }
}

// Load selected student information into form
function editStudent(studentID) {

    const student = currentStudents.find(
        student => student.ID === studentID
    );

    if (!student) {
        alert('Student record not found');
        return;
    }

    document.getElementById('studentId').value = student.ID;
    document.getElementById('studentNumber').value = student.studentNumber;
    document.getElementById('firstName').value = student.firstName;
    document.getElementById('lastName').value = student.lastName;
    document.getElementById('birthDate').value = student.birthDate;
    document.getElementById('course').value = student.course;
    document.getElementById('yearLevel').value = student.yearLevel;
    document.getElementById('status').value = student.status;

    // Change the submit button to Update Student
    document.getElementById('submitButton').textContent = 'Update Student';

    // Scroll to the form
    document.getElementById('studentForm').scrollIntoView({
        behavior: 'smooth'
    });
}

// Delete a student record
async function deleteStudent(studentID) {

    const confirmed = confirm(
        'Are you sure you want to delete this student?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${studentID}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete student');
        }

        alert('Student deleted successfully!');

        // Refresh the student table
        await loadStudents();

    } catch (error) {
        console.error('Error deleting student:', error);
        alert(error.message);
    }
}

// Reset form and return to Add Student mode
function clearForm() {

    document.getElementById('studentForm').reset();

    document.getElementById('studentId').value = '';

    document.getElementById('submitButton').textContent = 'Add Student';
}

// Search student records
async function searchStudents() {

    const keyword = document.getElementById('searchInput').value.trim();

    // Display all records if the search field is empty
    if (!keyword) {
        await loadStudents();
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/search?q=${encodeURIComponent(keyword)}`
        );

        const results = await response.json();

        if (!response.ok) {
            throw new Error(results.message || 'Failed to search students');
        }

        displayStudents(results);

    } catch (error) {
        console.error('Error searching students:', error);
        alert(error.message);
    }
}

// Connect form and buttons to their functions
document.getElementById('studentForm').addEventListener(
    'submit',
    saveStudent
);

document.getElementById('cancelButton').addEventListener(
    'click',
    clearForm
);

document.getElementById('searchButton').addEventListener(
    'click',
    searchStudents
);

document.getElementById('resetButton').addEventListener('click', () => {

    document.getElementById('searchInput').value = '';

    loadStudents();
});

// Enter key functionality
document.getElementById('searchInput').addEventListener('keydown', event => {

    if (event.key === 'Enter') {
        searchStudents();
    }
});

// Load students when the page opens
document.addEventListener('DOMContentLoaded', loadStudents);
