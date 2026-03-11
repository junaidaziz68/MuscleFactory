const fs = require('fs');
const path = require('path');
const db = require('../db');

const initDB = async () => {
    try {
        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon separator
        const queries = schema
            .split(';')
            .map((q) => q.trim())
            .filter((q) => q.length > 0);

        console.log('Executing schema queries...');
        for (const query of queries) {
            await db.execute(query);
            console.log('Query executed successfully.');
        }

        console.log('Database initialized successfully! You can now start the server and add your own data.');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        // Exit the script when done
        process.exit();
    }
};

initDB();
