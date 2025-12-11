.open requests.db
.mode box

CREATE TABLE IF NOT EXISTS users (

    user_id INTEGER PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_email UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    user_auth TEXT DEFAULT "Student"

);

CREATE TABLE IF NOT EXISTS requests (

    request_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    tutor_id INTEGER,
    request_class TEXT,
    request_time TEXT,
    request_location TEXT,
    archived INTEGER DEFAULT 0,
    FOREIGN KEY(student_id) REFERENCES users(user_id),
    FOREIGN KEY(tutor_id) REFERENCES users(user_id)

);

INSERT INTO users
    (user_name, user_email, user_password, user_auth)
VALUES
    ('Kathir Karunamurthy', 'kathir@hse.edu', 'password123', 'Student'),
    ('John Doe', 'john@hse.edu', 'password123', 'Tutor'),
    ('Jane Smith', 'jane@hse.edu', 'password123', 'Teacher');