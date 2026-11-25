# Student-Information-System
A small-scale, full-stack Student Information System built as a group project to apply software engineering principles, including system design, software testing, documentation, and API development.


## Setup (for database)
1. Start MySQL (e.g., via XAMPP)
2. Run `database/schema.sql` (phpMyAdmin > SQL tab, or the mysql CLI)
3. `Copy-Item .env.example .env` (or `cp` on Mac/Linux) and fill in your DB credentials
4. `npm install`
5. `npm run test-db` to verify the connection