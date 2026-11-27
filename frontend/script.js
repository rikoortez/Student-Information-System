// The backend serves the front end and API on the same address, so a relative
// URL keeps this working on localhost without hard-coding a server address.
const API_URL = '/api/students';

let currentStudents = [];
const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const formMessage = document.getElementById('formMessage');
const pageMessage = document.getElementById('pageMessage');

function showMessage(element, message = '', type = '') {
  element.textContent = message;
  element.className = `message ${type}`.trim();
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

async function loadStudents() {
  tableBody.innerHTML = '<tr><td class="table-placeholder" colspan="7">Loading student records…</td></tr>';
  showMessage(pageMessage);
  try {
    const response = await fetch(API_URL);
    displayStudents(await readResponse(response));
  } catch (error) {
    currentStudents = [];
    document.getElementById('recordCount').textContent = '0';
    tableBody.innerHTML = `<tr><td class="table-placeholder" colspan="7">${escapeHtml(error.message)}. Make sure the backend and database are running.</td></tr>`;
    showMessage(pageMessage, `Could not load records: ${error.message}`);
  }
}

async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/dashboard`);
    const summary = await readResponse(response);
    document.getElementById('totalStudents').textContent = summary.totalStudents ?? 0;
    document.getElementById('activeStudents').textContent = summary.activeStudents ?? 0;
    document.getElementById('inactiveStudents').textContent = summary.inactiveStudents ?? 0;
  } catch (error) {
    document.getElementById('totalStudents').textContent = '—';
    document.getElementById('activeStudents').textContent = '—';
    document.getElementById('inactiveStudents').textContent = '—';
    showMessage(pageMessage, `Dashboard summary unavailable: ${error.message}`);
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function formatDate(dateValue) {
  if (!dateValue) return '—';
  const [year, month, day] = String(dateValue).slice(0, 10).split('-');
  return year && month && day ? `${month}/${day}/${year}` : String(dateValue);
}

function displayStudents(students) {
  currentStudents = Array.isArray(students) ? students : [];
  document.getElementById('recordCount').textContent = currentStudents.length;
  tableBody.replaceChildren();

  if (currentStudents.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td class="table-placeholder" colspan="7">No student records found. Add a student above to get started.</td>';
    tableBody.appendChild(row);
    return;
  }

  currentStudents.forEach(student => {
    const row = document.createElement('tr');
    const fullName = `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim();
    const initials = fullName.split(/\s+/).map(part => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'S';
    const nameCell = document.createElement('td');
    nameCell.innerHTML = `<span class="student-initial" aria-hidden="true">${escapeHtml(initials)}</span><span class="student-name">${escapeHtml(fullName || 'Unnamed student')}</span>`;
    row.appendChild(nameCell);

    [student.studentNumber, formatDate(student.birthDate), student.course, `${student.yearLevel ?? '—'}${student.yearLevel ? ' year' : ''}`].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value ?? '—';
      row.appendChild(cell);
    });

    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = `status-chip${student.status === 'inactive' ? ' inactive' : ''}`;
    status.textContent = student.status || 'active';
    statusCell.appendChild(status);
    row.appendChild(statusCell);

    const actionsCell = document.createElement('td');
    const actions = document.createElement('div');
    actions.className = 'row-actions';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.setAttribute('aria-label', `Edit ${fullName || 'student'}`);
    editButton.addEventListener('click', () => editStudent(student.ID));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${fullName || 'student'}`);
    deleteButton.addEventListener('click', () => deleteStudent(student.ID));
    actions.append(editButton, deleteButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);
    tableBody.appendChild(row);
  });
}

async function saveStudent(event) {
  event.preventDefault();
  showMessage(formMessage);

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
  const isEditing = Boolean(studentID);

  try {
    const response = await fetch(isEditing ? `${API_URL}/${studentID}` : API_URL, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    await readResponse(response);
    clearForm();
    showMessage(pageMessage, isEditing ? 'Student record updated.' : 'Student added successfully.', 'success');
    await Promise.all([loadStudents(), loadDashboard()]);
  } catch (error) {
    showMessage(formMessage, error.message);
  }
}

function editStudent(studentID) {
  const student = currentStudents.find(record => String(record.ID) === String(studentID));
  if (!student) return;

  document.getElementById('studentId').value = student.ID;
  document.getElementById('studentNumber').value = student.studentNumber ?? '';
  document.getElementById('firstName').value = student.firstName ?? '';
  document.getElementById('lastName').value = student.lastName ?? '';
  document.getElementById('birthDate').value = String(student.birthDate ?? '').slice(0, 10);
  document.getElementById('course').value = student.course ?? '';
  document.getElementById('yearLevel').value = student.yearLevel ?? '';
  document.getElementById('status').value = student.status ?? 'active';
  document.getElementById('formTitle').textContent = 'Edit student';
  document.getElementById('submitButton').innerHTML = 'Save changes <span aria-hidden="true">✓</span>';
  document.getElementById('cancelButton').classList.remove('hidden');
  showMessage(formMessage);
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('studentNumber').focus({ preventScroll: true });
}

async function deleteStudent(studentID) {
  const student = currentStudents.find(record => String(record.ID) === String(studentID));
  const name = student ? `${student.firstName} ${student.lastName}`.trim() : 'this student';
  if (!window.confirm(`Delete ${name}'s record? This action cannot be undone.`)) return;

  try {
    const response = await fetch(`${API_URL}/${studentID}`, { method: 'DELETE' });
    await readResponse(response);
    showMessage(pageMessage, 'Student record deleted.', 'success');
    await Promise.all([loadStudents(), loadDashboard()]);
  } catch (error) {
    showMessage(pageMessage, `Could not delete the record: ${error.message}`);
  }
}

function clearForm() {
  form.reset();
  document.getElementById('studentId').value = '';
  document.getElementById('formTitle').textContent = 'Add a student';
  document.getElementById('submitButton').innerHTML = 'Add student <span aria-hidden="true">＋</span>';
  document.getElementById('cancelButton').classList.add('hidden');
  showMessage(formMessage);
}

async function searchStudents(event) {
  if (event) event.preventDefault();
  const keyword = document.getElementById('searchInput').value.trim();
  if (!keyword) {
    await loadStudents();
    return;
  }

  showMessage(pageMessage);
  tableBody.innerHTML = '<tr><td class="table-placeholder" colspan="7">Searching student records…</td></tr>';
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(keyword)}`);
    displayStudents(await readResponse(response));
  } catch (error) {
    showMessage(pageMessage, `Search failed: ${error.message}`);
  }
}

form.addEventListener('submit', saveStudent);
document.getElementById('cancelButton').addEventListener('click', clearForm);
document.getElementById('searchForm').addEventListener('submit', searchStudents);
document.getElementById('resetButton').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  loadStudents();
});
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});
document.addEventListener('DOMContentLoaded', () => {
  loadStudents();
  loadDashboard();
});
