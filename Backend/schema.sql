DROP TABLE IF EXISTS workout_exercises;
DROP TABLE IF EXISTS workouts;

CREATE TABLE workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE workout_exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    `sets` INT NOT NULL,
    reps INT NOT NULL,
    weight FLOAT NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

INSERT INTO workouts (name, date) VALUES 
('Morning Routine', '2023-11-01'),
('Evening Heavy Lift', '2023-11-02');

INSERT INTO workout_exercises (workout_id, name, `sets`, reps, weight) VALUES 
(1, 'Push Ups', 3, 15, 0),
(1, 'Pull Ups', 3, 8, 0),
(2, 'Bench Press', 4, 8, 135),
(2, 'Squats', 4, 10, 185);
