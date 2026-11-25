const pool = require('./config/db');

(async () => {
    try {
        const [[row]] = await pool.query('SELECT COUNT(*) AS total FROM students');
        console.log('Connected. students table rows: ', row.total);
    } catch (err) {
        console.error('Connection failed: ', err.code, '-', err.message);
    }finally {
        await pool.end();
    }
})();