import sqlite3

def get_user_by_email(email):
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_email = ?", (email,))
        row = cursor.fetchone()
        return dict(row) if row else None

def add_request(user_id, title, student_grade, class_subject, description):
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO requests (user_id, title, student_grade, class_subject, description) VALUES (?, ?, ?, ?, ?)", (user_id, title, student_grade, class_subject, description))
        conn.commit()

def get_all_requests():
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM requests")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]