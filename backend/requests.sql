.open requests.db
.mode box

CREATE TABLE IF NOT EXISTS requests (

    request_id INTEGER PRIMARY KEY,
    student_id TEXT,
    request_description TEXT,
    request_class TEXT,
    request_time TEXT,
    request_location TEXT,
    tutor_id TEXT,
    archived BOOLEAN

);

CREATE TABLE IF NOT EXISTS users (

    user_name TEXT,
    user_email TEXT,
    user_password TEXT,
    user_auth TEXT 

);