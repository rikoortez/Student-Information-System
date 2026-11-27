# Student Information System
    - A local web application for managing student records. The frontend uses HTML, CSS, and JavaScript. A Node.js backend 
      connects the app to a MySQL or MariaDB database.

# Features
    - Add student records
    - View and search student records
    - Edit and delete records
    - Store student number, course, name, birth date, year level, and status
    - View dashboard information

# Requirements
    - Node.js
    - XAMPP with MySQL or MariaDB
    - A web browser

# Setup

1. Start the database
    1. Open the XAMPP Control Panel.
    2. Start MySQL and wait until it shows as running.
    3. Open http://localhost/phpmyadmin.
    4. Run database/schema.sql from phpMyAdmin's SQL tab or Import page. If asked to select a database, choose or create student_management.

2. Configure environment variables
    - From the project root, create .env if it does not already exist:
        Copy-Item .env.example .env
    
    - Edit .env to match your local database settings. The example settings are:
        DB_HOST=localhost
        DB_PORT=3306
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=student_management
        PORT=3000

    - Leave DB_PASSWORD blank only if your local XAMPP root account has no password. Do not commit .env or credentials to GitHub.

3. Install dependencies and start the app
    - In PowerShell, go to the project root and run:
        cd C:\xampp\htdocs\Student-Information-System
        npm.cmd install
        npm.cmd install --prefix backend
        node .\backend\server.js

    - Keep that terminal open while using the application. Then open:
        http://localhost:3000

    - Open the application through this address so the frontend and API use the same server. Opening frontend/index.html through 
      Apache may cause API requests to return 404.

4. Check the database connection
    - With MySQL running and .env configured, run this from the project root:   
        npm.cmd run test-db

# Project Structure
    Student-Information-System/
    ├── backend/
    │   ├── db.js
    │   ├── package.json
    │   └── server.js
    ├── database/
    │   └── schema.sql
    ├── frontend/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    ├── postman/
    ├── .env.example
    ├── package.json
    └── test-db.js

# Troubleshooting 
    - PowerShell blocks npm: Use npm.cmd commands as shown above.
    - The page says Request failed (404): Make sure node .\backend\server.js is still running and open http://localhost:3000.
    - The database connection fails: Confirm MySQL is running, database/schema.sql has been run, and the .env values match your 
      database.
    - MySQL shuts down unexpectedly: Check the MySQL log in XAMPP. Back up C:\xampp\mysql\data before attempting repairs; do not 
      delete database files as a first step.

# User Guide
    - This guide explains how to open the Student Information System and use its student record features. It is intended for users 
      who have already completed the initial database and application setup.

1. Opening the Application
    1. Start MySQL in the XAMPP Control Panel.
    2. Open PowerShell in the project folder.
    3. Start the backend: 
            node .\backend\server.js
    4. Leave the PowerShell window open while using the application.
    5. In a browser, open http://localhost:3000.

    - Use this address to keep the frontend and API on the same server. Opening the files through the Apache folder URL may cause 
      requests to fail.

2. Viewing the dashboard and student list
    1. Use the application navigation to open the dashboard or student list.
    2. Review the displayed student information and dashboard details.
    3. If the list provides a search field, enter a search term and review the matching records.

3. Add a Student
    1. Open the student form and select Add student.
    2. Complete the student details:
        - Student number
        - Course
        - First name
        - Last name
        - Birth date
        - Year level
        - Status
    3. Choose Active or Inactive for the student's status.
    4. Check the information, especially the student number, and select Add student.
    5. If an error appears, make sure the backend is running and MySQL is available.
       Complete every field marked as required.

4. Search for a Student
    1. Open the student list.
    2. Enter a search term in the search field.
    3. Review the matching records and confirm the student number before choosing a record.

5. Edit a Student
    1. Find the student's record in the list.
    2. Select its edit control.
    3. Change the needed details and save the record.
    4. Review the updated details in the list.

6. Delete a Student
    1. Find the correct student's record.
    2. Select its delete control.
    3. Check the student number and name carefully. Confirm the deletion if the application asks.

# Troubleshooting
    - Request failed (404): Make sure the backend is running in PowerShell and reopen http://localhost:3000.
    - Database connection error: Check that MySQL is running in XAMPP and the .env database settings match your database.
    - The page stops responding after closing PowerShell: Start the backend again and keep its PowerShell window open.