.open requests.db
.mode box

"""
SQL code to create tables and create testing data for users and requests

Tables:
- users, to represent the users of the app and store their data
- requests, to represent tutoring requests made by students
"""

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

INSERT INTO users -- inserting testing data of users to use to test the app
    (user_name, user_email, user_password, user_grade,user_auth)
VALUES
    ('Kathir Karunamurthy', 'kathir@hse.edu', 'password123', '10', 'Student'), -- example student user
    ('John Doe', 'john@hse.edu', 'password123', '11', 'Tutor'), -- example tutor user
    ('Jane Smith', 'jane@hse.edu', 'password123', null, 'Teacher'); -- example teacher/admin user