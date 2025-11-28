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

