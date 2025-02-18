const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const queries = require('./queries'); // Import your queries module

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors({
    origin: '*',
    methods: 'GET, POST',
})); // Use the CORS middleware to allow all origins

// Endpoint to insert a new user
app.all('/addData', (req, res) => {
    if (req.method === 'POST') {
        const { id, name, easywin, easytie, easylose, hardtie, hardlose } = req.body;
        queries.addData(id, name, easywin, easytie, easylose, hardtie, hardlose, (error, results) => {
            if (error) {
                console.error('Error inserting or updating user data:', error);
                res.status(500).json({ error: 'Error inserting or updating user data' });
                return;
            }
            res.status(200).json({ message: 'User data inserted or updated successfully' });
        });
    } else {
        // Handle GET requests to /addData (if needed)
        res.status(405).json({ error: 'Method Not Allowed' }); // Return 405 Method Not Allowed for GET requests
    }
});

// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
    // Serve a default HTML page or a welcome message
    res.send('Welcome to the Tic Tac Toe API!');
  });

// Endpoint to get users
app.get('/getUsers', (req, res) => {
    queries.getUsers((error, results) => {
        if (error) {
            console.error('Error getting users:', error); // Fix typo here
            res.status(500).send('Error getting users');
            return;
        }
        res.status(200).json(results); // Send fetched users in the response
    });
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
