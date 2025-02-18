# Creates table with auto increment enabled
CREATE TABLE tictactoe.Score (
	score_id MEDIUMINT NOT NULL AUTO_INCREMENT,
    name char(255),
    easy_win int,
    easy_tie int,
    easy_lose int,
    hard_tie int,
    hard_lose int,
    PRIMARY KEY (score_id)
);


# Dummy data to test the database functionality
INSERT INTO tictactoe.Score 
VALUES (3, "Tyler", 10, 0, 0, 10, 3),
(4, "George", 5, 2, 7, 0, 4),
 (5, "Isaiah", 2, 1, 5, 4, 1),
 (6, "Joe", 4, 1, 2, 1, 1),
 (7, "Josh", 12, 52, 1, 6, 9),
 (8, "Emily", 4, 2, 2, 1, 3),
 (9, "Victoria", 1, 0, 5, 6, 2),
 (10, "Sandra", 8, 7, 2, 6, 8),
 (11, "Paul", 2, 5, 6, 2, 1),
 (12, "Cassie", 16, 4, 5, 10, 7);