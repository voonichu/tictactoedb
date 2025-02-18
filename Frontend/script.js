var origBoard; // Original Board
let human = 'O'; // Sets human player to O
let ai = 'X'; // Sets AI player to X
var difficulty = "none";
const winCombos = [
    // Horizontal Wins
    [0,1,2], 
    [3,4,5],
    [6,7,8],
    // Vertical Wins
    [0,3,6],
    [1,4,7],
    [2,5,8],
    // Diagonal Wins
    [0,4,8],
    [6,4,2]
];

var score = {
    easy_win: 0,
    easy_tie: 0,
    easy_lose: 0,
    hard_tie: 0,
    hard_lose: 0
};

let usersData = {}
const cells = document.querySelectorAll('.cell'); // Gets cells class from table in tictactoe.html 
fetchUsers(); // Fetches data from database and populates the leaderboard table


function startGame() {
    document.querySelector(".startgame").style.display = "none"; // Sets startgame section of html code to be hidden
    document.querySelector(".endgame").style.display = "none"; // Sets endgame section of html code to be hidden
    document.querySelector(".name").style.display = "none";
    origBoard = Array.from(Array(9).keys()); // Sets origBoard to be an empty array of length 9
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false); // Adds event listener to every cell on the board
    }
    selectFirstPlayer(); // Calls select first player function
}

function easyMode() { // Sets difficulty to easy
    difficulty = "easy";
    startGame();
}

function hardMode() { // Sets difficulty to hard (unbeatable/minimax)
    difficulty = "hard";
    startGame();
}

function selectFirstPlayer() { // Randomly decides first player
    let player1 = Math.floor(Math.random() * 2);
    if (player1 == 0 && difficulty == "easy") {
        turn(nextSpot(origBoard), ai);
    } else if (player1 == 0 && difficulty == "hard") {
        turn(bestSpot(origBoard), ai);
    }
}

function restart() { // Restarts the game
    document.querySelector(".startgame").style.display = "block"; // Difficulty selector becomes visible
    document.querySelector(".endgame").style.display = "none"; // Removes winner text and background
    document.querySelector(".name").style.display = "none";
    origBoard = Array.from(Array(9).keys()); // Resets origBoard to be an empty array of length 9
    for (var i = 0; i < cells.length; i++) { // Loops through every cell in array
        cells[i].innerText = ""; // Removes all text
        cells[i].style.removeProperty('background-color'); // Removes winner background color 
    }
}

function turnClick(square) { // Function that allows human to click
    if (typeof origBoard[square.target.id] == 'number' && !checkWin(origBoard, human) && !checkTie()) {
        origBoard[square] = human;
        turn(square.target.id, human);
        if (difficulty == "easy") { // Checks difficulty
            if (!checkWin(origBoard, human) && !checkTie()) turn(nextSpot(origBoard), ai); // Calls easy AI turn function
        }
        else { // Assumes difficulty is not easy (in case random function breaks somehow)
            if (!checkWin(origBoard, human) && !checkTie()) turn(bestSpot(origBoard), ai); // Calls hard AI turn function (minimax algorithm)
        }
        if (emptySquares(origBoard).length === 0) checkTie(); // Checks for tie if there are no more available squares
        
    }
}

function turn(squareId, player) { // Turn function
    origBoard[squareId] = player; // Sets the origBoard array to be player at the specified index
    document.getElementById(squareId).innerText = player; // Displays the text to be player at specified index
    let gameWon = checkWin(origBoard, player);  // Checks if the game has been won
    if (gameWon) gameOver(gameWon); // Sets game state to be game over if gameWon is true
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => // Looks for every index on the board that the player has played in
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) { // Loops through every win combination in winCombos
		if (win.every(elem => plays.indexOf(elem) > -1)) { // Checks if the player has played in every spot required for each win as it loops
			gameWon = {index: index, player: player}; // Sets gameWon state, including its index for stylization
			break; // Breaks from function (game has already been decided as a win)
		}
	}
	return gameWon;
}


function gameOver(gameWon) { // Stylization for win state
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
        gameWon.player == human ? "blue" : "red"; // Sets background color to blue for player and red for ai
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }

    
    fetchUsers();
    declareWinner(gameWon.player == human ? "You win!" : "You lose."); // Declares whether the player wins or loses
    document.querySelector(".name").style.display = "block";
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block"; // Makes block element visible that is previously invisible 
    document.querySelector(".endgame .text").innerText = who; // Changes text to player who wins
}

function checkTie(gameWon) { // Checks if the game is tied
    if (!gameWon) {
        if (emptySquares().length == 0) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = "green"; // Sets all background cells to be green
                cells[i].removeEventListener('click', turnClick, false); // Removes event listener so player can no longer click
            }
            declareWinner("Tie Game!"); // Text to display to player
            document.querySelector(".name").style.display = "block";
            fetchUsers();
            return true; // Returns true to indicate tie
        }
        return false; // Returns false to let the game continue
    }

}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number'); // returns an array of all empty squares in origBoard
}

function nextSpot() {
        return emptySquares() [0]; // Returns the next available spot in the empty squares array
}

function bestSpot(board) {
    return minimax(origBoard, ai).index; // Returns the index for best move from minimax function
}
    
function minimax(board, player) {
    var availSpots = emptySquares(); // Sets a local (funtion) variable to the empty squares array


    if (checkWin(board, human)) { // Checks if human player wins
        return {score: -10}; // Returns a score of -10 to indicate a bad result
    } else if (checkWin(board, ai)) { // Checks if ai player wins
        return {score: 10}; // Returns a score of 10 to indicate a good result
    } else if (availSpots.length === 0) { // Checks if all availSpots are filled after checking if either player won (tie)
        return {score: 0}; // Returns a score of 0 to indicate a neutral score
    }

    var moves = [] // Creates an empty array named moves
    for (var i = 0; i < availSpots.length; i++) { // Loops through every available spot
        var move = {}; // Creates an empty dictionary named move to store all scores (checks how good every move is)
        move.index = board[availSpots[i]]; // Sets the move index to the next available spot 
        board[availSpots[i]] = player; // Checks every available spot and sets it the next player

        if (player == ai) { // Checks if the player is the AI ("Maximizes" its score)
            var result = minimax(board, human); // Saves the result and recursively calls itself but changes the player to human
            move.score = result.score; // Saves the result to move dictionary
        } else { // Minimizes the score of the human player
            var result = minimax(board, ai); // Saves the result and recursively calls itself but changes the player to ai
            move.score = result.score; // Saves the result to move dictionary
        }

        board[availSpots[i]] = move.index; // Sets the next available spot to the move index
        moves.push(move); // Pushes move value (score) to moves array
    }

    var bestSpot; // Creates best spot variable

    if (player === ai) { // Maximizing
        let bestScore = -10000; // Creates best score variable and sets it to very low negative number (so it will always start lower)
        for (let i = 0; i < moves.length; i++) { // Loops through moves array
            if (moves[i].score > bestScore) { // Checks for highest (max) score
                bestScore = moves[i].score; // Sets highest score to best score
                bestSpot = i; // Sets the best spot to the highest score
            }
        }
    } else { // Minimizing
        let bestScore = 10000; // Creates best score variable and sets it very high positive number (so it will always start higher)
        for (let i = 0; i < moves.length; i++) { // Loops through moves array
            if (moves[i].score < bestScore) { // Checks for lowest (min) score
                bestScore = moves[i].score; // Sets lowest score to best score (best score for player)
                bestSpot = i; // Sets best spot to the lowest score (assumes player will always make best move)
            }  
        }
    }

    return moves[bestSpot]; // Returns the best spot for current (iteration) player until final iteration (returns best spot for AI)
}


// Database + Leadboard

function fetchUsers() {
    fetch('http://localhost:3000/getUsers')
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    data.forEach(user => {
            usersData[user.name] = user; // Store user data using their name as key
        });
        console.log('Users data:', usersData); // Check usersData object
  // Calculate top scores and save them in order
  const sortedUsers = Object.values(usersData).sort((a, b) => {
    const scoreA = calculateScore(a);
    const scoreB = calculateScore(b);
    return scoreB - scoreA; // Sort in descending order
});
const leaderboardData = sortedUsers.slice(0, 10).map(user => ({
    name: user.name,
    score: calculateScore(user)
}));
console.log('Leaderboard data:', leaderboardData);

populateLeaderboard(leaderboardData); // Populate leaderboard with top scores
})
.catch(error => {
console.error('Error fetching users:', error);
});
}


document.getElementById('dataform').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the form data
    const formData = new FormData(this);
    const name = formData.get('name');

    for (users in usersData) {
        if ((usersData[users].name) === name) {
            score.easy_win = usersData[users].easy_win;
            score.easy_tie = usersData[users].easy_tie;
            score.easy_lose = usersData[users].easy_lose;
            score.hard_tie = usersData[users].hard_tie;
            score.hard_lose = usersData[users].hard_tie;
        } 
    }
    addScore();
   
    // Set variables to pass to database
    const easywin = score.easy_win;
    const easytie = score.easy_tie;
    const easylose = score.easy_lose;
    const hardtie = score.hard_tie;
    const hardlose = score.hard_lose;

    

    fetch('http://localhost:3000/addData', {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ name, easywin, easytie, easylose, hardtie, hardlose })
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('User inserted successfully:', data.message);
    })
    .then(error => {
      console.error('Error inserting user:', error);
    });
  });

  function addScore() {
    const gameWon = checkWin(origBoard, human) || checkWin(origBoard, ai);

    if (gameWon === null && checkTie()) {
        if (difficulty === "easy") {
            score.easy_tie += 1;
        } else if (difficulty === "hard") {
            score.hard_tie += 1;
        }
    } else if (gameWon && gameWon.player === human && difficulty === "easy") {
        score.easy_win += 1;
    } else if (gameWon && gameWon.player === ai && difficulty === "easy") {
        score.easy_lose += 1;
    } else if (gameWon && gameWon.player === ai && difficulty === "hard") {
        score.hard_lose += 1;
    }
}

function calculateScore(user) {
    return (user.easy_win * 5) + (user.easy_tie * 2) + (user.easy_lose * -2) + (user.hard_tie * 10) + (user.hard_lose * -5);
}

function populateLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing leaderboard

    // Loop through leaderboardData and create elements for each player
    leaderboardData.slice(0, 10).forEach((player, index) => {
        const playerElement = document.createElement("div");
        playerElement.classList.add("player");
        playerElement.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>Score: ${player.score}</span>
        `;
        leaderboardList.appendChild(playerElement); // Append player element to leaderboard
    });
}