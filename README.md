# TicTacToe
Unbeatable TicTacToe using minimax algorithm project with a leaderboard
This project has 2 main factors to running it.
1. In the "Frontend" folder, opening the "index.html" file will allow you to have full functionality of the Tic Tac Toe AI and also have the option to play an easier version (specifically to showcase that the player can win)
2. In the "Backend" folder, running the server.js file with Node.js will add proper functionality to the leaderboard if the MySQL database exists on the device running the file.
3. To setup the MySQL database, a schema with the name tictactoe, a table within the schema named Score, a user with the name "root" and a password "database28" should be used in order for the server.js file to be able to access it, or alternatively edit the db.js file and change the user and password within the pool variable. The queries used for the table creation and dummy data insertion are included in "tictactoe database.sql"