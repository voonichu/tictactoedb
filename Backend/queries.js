const db = require('./db');

// queries.js
function getUsers(callback) {
    const query = 'SELECT * FROM Score';
    db.executeQuery(query, [], (error, results) => {
        if (error) {
            console.error('Error retrieving users:', error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
}

function addData(id, name, easywin, easytie, easylose, hardtie, hardlose, callback) {
    // Check if the name already exists in the database
    console.log(name, easywin, easytie, easylose, hardtie, hardlose);
    const query = 'SELECT * FROM Score WHERE name = ?';
    db.executeQuery(query, [name], (error, results) => {
        if (error) {
            // Handle error by calling the callback function
            if (callback) {
                callback(error, null);
            }
            return;
        }

        if (results.length > 0) {
            // Name already exists, update the existing record
            const existingUser = results[0];
            const updateQuery = `UPDATE Score SET easy_win = ?, easy_tie = ?, easy_lose = ?, hard_tie = ?, hard_lose = ? WHERE name = ?`;
            const params = [easywin, easytie, easylose, hardtie, hardlose, name];
            db.executeQuery(updateQuery, params, callback);
        } else {
            // Name doesn't exist, insert a new record
            const insertQuery = 'INSERT INTO Score (name, easy_win, easy_tie, easy_lose, hard_tie, hard_lose) VALUES (?, ?, ?, ?, ?, ?)';
            const params = [name, easywin, easytie, easylose, hardtie, hardlose];
            console.log(params);
            db.executeQuery(insertQuery, params, callback);
        }
    });
}



module.exports = { getUsers, addData }; // Export both functions separately
