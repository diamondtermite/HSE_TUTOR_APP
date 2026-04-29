.open requests.db
.mode box

/*
SQL code to create tables and create testing data for users and requests

Tables:
- users, to represent the users of the app and store their data
- requests, to represent tutoring requests made by students
*/

CREATE TABLE IF NOT EXISTS users (

    user_id INTEGER PRIMARY KEY, -- unique ID for each user that is auto-incremented
    user_name TEXT NOT NULL, -- the name of the user, that must exist and can't be null
    user_email UNIQUE NOT NULL, -- the email of the user, that must exist, can't be null, and must be unique
    user_password TEXT NOT NULL, -- the password of the user, that must exist and can't be null
    user_grade TEXT DEFAULT "9", -- the grade of the user, that defaults to 9 if not specified
    user_auth TEXT DEFAULT "Student" -- the authorization level of the user, that defaults to "Student" if not specified

);

CREATE TABLE IF NOT EXISTS requests (

    request_id INTEGER PRIMARY KEY, -- unique ID for each request that is auto-incremented
    student_id INTEGER NOT NULL, -- the ID of the student who made the request, that must exist and can't be null
    student_name TEXT NOT NULL, -- the name of the student who made the request, that must exist and can't be null
    student_grade TEXT NOT NULL, -- the grade of the student who made the request, that must exist and can't be null
    tutor_id INTEGER, -- the ID of the tutor who accepted the request, that can be null if no tutor has accepted yet
    tutor_name TEXT, -- the name of the tutor who accepted the request, that can be null if no tutor has accepted yet
    tutor_grade TEXT, -- the grade of the tutor who accepted the request, that can be null if no tutor has accepted yet
    request_subject TEXT NOT NULL, -- the subject of the tutoring request, that must exist and can't be null
    request_date TEXT NOT NULL, -- the date of the tutoring request, that must exist and can't be null
    request_start_time TEXT NOT NULL, -- the start time of the tutoring request, that must exist and can't be null
    request_end_time TEXT NOT NULL, -- the end time of the tutoring request, that must exist and can't be null
    request_location TEXT NOT NULL, -- the location of the tutoring request, that must exist and can't be null
    archived INTEGER DEFAULT 0, -- whether the request is archived (1) or not (0), that defaults to 0 if not specified
    FOREIGN KEY(student_id) REFERENCES users(user_id), -- linking student_id to user_id in users table
    FOREIGN KEY(tutor_id) REFERENCES users(user_id) -- linking tutor_id to user_id in users table

);

CREATE TABLE IF NOT EXISTS clubs (

    club_id INTEGER PRIMARY KEY, -- unique ID for each club that is auto-incremented
    club_name TEXT NOT NULL UNIQUE, -- the name of the club/honor society, that must exist and be unique
    code TEXT NOT NULL UNIQUE -- the 4-digit code for the club, that must exist and be unique

);

CREATE TABLE IF NOT EXISTS tutor_clubs (

    tutor_id INTEGER NOT NULL, -- the ID of the tutor who is in the club, that must exist and can't be null
    club_id INTEGER NOT NULL, -- the ID of the club, that must exist and can't be null
    PRIMARY KEY(tutor_id, club_id), -- composite primary key to ensure each tutor is only in each club once
    FOREIGN KEY(tutor_id) REFERENCES users(user_id), -- linking tutor_id to user_id in users table
    FOREIGN KEY(club_id) REFERENCES clubs(club_id) -- linking club_id to club_id in clubs table

);

INSERT INTO users -- inserting testing data of users to use to test the app
    (user_name, user_email, user_password, user_grade,user_auth)
VALUES
    ('Kathir Karunamurthy', 'kathir@hse.edu', 'password123', '10', 'Student'), -- example student user
    ('John Doe', 'john@hse.edu', 'password123', '11', 'Tutor'), -- example tutor user
    ('Jane Smith', 'jane@hse.edu', 'password123', null, 'Teacher'), -- example teacher/admin user
    ('Alex Johnson', 'alex@hse.edu', 'password123', '9', 'Student'),
    ('Sarah Williams', 'sarah@hse.edu', 'password123', '10', 'Student'),
    ('Michael Brown', 'michael@hse.edu', 'password123', '11', 'Student'),
    ('Emily Davis', 'emily@hse.edu', 'password123', '12', 'Student'),
    ('David Martinez', 'david@hse.edu', 'password123', '9', 'Student'),
    ('Jessica Garcia', 'jessica@hse.edu', 'password123', '10', 'Student'),
    ('James Rodriguez', 'james@hse.edu', 'password123', '11', 'Student'),
    ('Lisa Anderson', 'lisa@hse.edu', 'password123', '12', 'Student'),
    ('Ryan Taylor', 'ryan@hse.edu', 'password123', '9', 'Student'),
    ('Amanda Thomas', 'amanda@hse.edu', 'password123', '10', 'Student'),
    ('Christopher Moore', 'christopher@hse.edu', 'password123', '11', 'Student'),
    ('Nicole Jackson', 'nicole@hse.edu', 'password123', '12', 'Student'),
    ('Daniel White', 'daniel@hse.edu', 'password123', '9', 'Student'),
    ('Katherine Harris', 'katherine@hse.edu', 'password123', '10', 'Student'),
    ('Matthew Martin', 'matthew@hse.edu', 'password123', '11', 'Student');

INSERT INTO clubs -- inserting honor societies and clubs available to tutors
    (club_name, code)
VALUES
    ('National Honor Society', '1001'),
    ('Computer Science Honor Society', '1002'),
    ('Rho Kappa Honor Society', '1003'),
    ('National English Honor Society', '1004'),
    ('Science National Honor Society', '1005'),
    ('German Honor Society', '1006'),
    ('Spanish Honor Society', '1007'),
    ('French Honor Society', '1008'),
    ('Mu Alpha Theta', '1009');

INSERT INTO tutor_clubs -- associating tutors with their clubs/honor societies
    (tutor_id, club_id)
VALUES
    (2, 1); -- John Doe is in National Honor Society (club_id 1)