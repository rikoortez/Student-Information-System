# Student Information Management System : API Documentation

base url : http://localhost:3000/api/students

## New Students
    * URL : POST 'http://localhost:3000/api/students'
    * Endpoint : '/api/students'
    * Desc : Registers a new student record in the database
    * Success Response : '201 Created'
    * Request Parameters : 
        * studentNumber (string, required) : Unique student ID number
        * firstName (string, required) : Student's first name
        * lastName (string, required) : Student's last name
        * birthDate (string, required) : Birth date (YYYY-MM-DD)
        * course (string, required) : Degree program (e.g., `BSCS`, `BSIT`)
        * yearLevel (integer, required) : Current year level (1–4)
        * status (string, optional) : active || inactive (active default)
    * Example Response :
        ```json
        [
            {
                "ID": 1,
                "studentNumber": "2026-0001",
                "firstName": "Enrico Miguel",
                "lastName": "Orteza",
                "birthDate": "2006-01-24",
                "course": "BSCS",
                "yearLevel": 3,
                "status": "active",
                "createdAt": "2026-11-22T04:00:00.000Z"
            }
        ]
        ```

## Display Students
    * URL : GET 'http://localhost:3000/api/students'
    * Endpoint : '/api/students'
    * Desc : Retrieves list of all registered student records
    * Success Response : '200 OK'
    * Example Response :
        ```json
        [
            {
                "ID": 1,
                "studentNumber": "2026-0001",
                "firstName": "Enrico Miguel",
                "lastName": "Orteza",
                "birthDate": "2006-01-24",
                "course": "BSCS",
                "yearLevel": 3,
                "status": "active",
                "createdAt": "2026-11-22T04:00:00.000Z"
            }
        ]
        ```

## Update Students
    * URL : PUT 'http://localhost:3000/api/students/:id'
    * Endpoint : api/students/:id
    * Desc : Updates existing student's record from database using their ID
    * Success Response : '200 OK'
    * Request Parameters : 
        * studentNumber (string, required) : Unique student ID number
        * firstName (string, required) : Student's first name
        * lastName (string, required) : Student's last name
        * birthDate (string, required) : Birth date (YYYY-MM-DD)
        * course (string, required) : Degree program (e.g., `BSCS`, `BSIT`)
        * yearLevel (integer, required) : Current year level (1–4)
        * status (string, optional) : active || inactive (active default)

## Delete Students
    * URL : DELETE 'http://localhost:3000/api/students/:id'
    * Endpoint : '/api/students/:id'
    * Desc : Removes student record from database using their ID
    * Success Response : '200 OK'
    * Request Parameters :
        * id (integer, required) : Unique database ID in the URL path


## Search Students
    * URL : GET 'http://localhost:3000/api/students/search?q={keyword}'
    * Endpoint : 'api/students/search?q={keyword}'
    * Desc : Searches students by studentNumber, firstName,lastName, course
    * Success Response : '200 OK'
    * Request Parameters :
        * q (string, required) : Search keyword in the URL query

## Dashboard
    * URL : GET 'http://localhost:3000/api/students/dashboard'
    * Endpoint : '/api/students/dashboard'
    * Desc : Retrieves summary statistics of total, active, and inactive student records
    * Success Response : '200 OK'
    * Example Response : 
        ```json
        {
            "totalStudents": 10,
            "activeStudents": 8,
            "inactiveStudents": 2
        }
        ```

