import sqlite3 #importing sqlite3 module to work with SQLite databases

"""
This file contains functions to interact with the SQLite database for user and request management.

get_user_by_email(email): Fetches user details by finding the user with the specified email (emails are unique)
get_user_name_by_id(user_id): Retrieves the name of the user based on their user ID (unique IDs)
get_user_grade_by_id(user_id): Retrieves the grade of the user based on their user ID (unique IDs)
add_request(user_id, class_subject, date, start_time, end_time, location): Adds a new tutoring request to the database with the provided details
get_requests(query, params): Executes a custom SQL query with dynamic query parameters to fetch requests from the database with different filtering options
accept_request(tutor_id, request_id): Updates a specific request in the database to assign a tutor to it
"""

def get_user_by_email(email):
    with sqlite3.connect("requests.db") as conn: #connecting to the database, "requests.db"
        conn.row_factory = sqlite3.Row # determines that we will fetch by row, and take the data as more useful dictionary-like objects rather than tuples
        cursor = conn.cursor() # creating a cursor object to execute SQL commands
        cursor.execute("SELECT * FROM users WHERE user_email = ?", (email,)) # executing SQL query to select user by email 
        row = cursor.fetchone() # fetching the first row of the result set
        return dict(row) if row else None # returns the row as a dictionary, as it makes it easier to work with the data, or none if it doesn't exist


def get_user_by_id(user_id):
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def get_user_name_by_id(user_id):
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT user_name FROM users WHERE user_id = ?", (user_id,)) # executing SQL query to select user name by user ID
        row = cursor.fetchone()
        return row['user_name'] if row else None

def get_user_grade_by_id(user_id):
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT user_grade FROM users WHERE user_id = ?", (user_id,)) # executing SQL query to select user grade by user ID
        row = cursor.fetchone()
        return row['user_grade'] if row else None

def add_request(user_id, class_subject, date, start_time, end_time, location):
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        user = get_user_by_id(user_id)
        # If teacher, set grade to "Teacher", otherwise use actual grade
        student_grade = "Teacher" if user['user_auth'] == 'Teacher' else get_user_grade_by_id(user_id)
        cursor.execute("INSERT INTO requests (student_id, student_name, student_grade, request_subject, request_date, request_start_time, request_end_time, request_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (user_id, get_user_name_by_id(user_id), student_grade, class_subject, date, start_time, end_time, location)) # inserting a new request into the requests table with the provided details
        conn.commit()
        # No return value as it is updating the database

def get_requests(query, params):

    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params) # executing the provided SQL query with the provided parameters
        rows = cursor.fetchall() # fetching all rows of the result set
        return [dict(row) for row in rows] # returning a list of dictionaries, each representing a row in the result set
    
def accept_request(tutor_id, request_id):
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE requests SET tutor_id = ?, tutor_name = ?, tutor_grade = ? WHERE request_id = ?", (tutor_id, get_user_name_by_id(tutor_id), get_user_grade_by_id(tutor_id), request_id,)) # updating the request to assign the tutor to it
        conn.commit()

def set_archive_status(request_id, state):
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE requests SET archived = ? WHERE request_id = ?", (state, request_id,))
        conn.commit()

def remove_tutor(request_id):
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE requests SET tutor_id = NULL, tutor_name = NULL, tutor_grade = NULL WHERE request_id = ?", (request_id,))
        conn.commit()

def archive_past_requests():
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE requests SET archived = 1 WHERE archived = 0 AND tutor_id IS NULL AND request_date < DATE('now')")
        conn.commit()

def archive_request_by_user(request_id, user_id):
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT student_id FROM requests WHERE request_id = ?", (request_id,))
        row = cursor.fetchone()
        if row and row[0] == user_id:
            cursor.execute("UPDATE requests SET archived = 1 WHERE request_id = ?", (request_id,))
            conn.commit()
            return True
        return False

def remove_self_from_request(request_id, user_id):
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT tutor_id FROM requests WHERE request_id = ?", (request_id,))
        row = cursor.fetchone()
        if row and row[0] == user_id:
            cursor.execute("UPDATE requests SET tutor_id = NULL, tutor_name = NULL, tutor_grade = NULL WHERE request_id = ?", (request_id,))
            conn.commit()
            return True
        return False

def get_all_tutors():
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, user_name, user_grade, user_email FROM users WHERE user_auth = 'Tutor'")
        rows = cursor.fetchall()
        tutors = []
        for row in rows:
            tutor_dict = dict(row)
            # Get clubs for this tutor
            cursor.execute("SELECT clubs.club_name FROM clubs JOIN tutor_clubs ON clubs.club_id = tutor_clubs.club_id WHERE tutor_clubs.tutor_id = ?", (row['user_id'],))
            club_rows = cursor.fetchall()
            tutor_dict['clubs'] = [club_row['club_name'] for club_row in club_rows]
            tutors.append(tutor_dict)
        return tutors

def get_all_clubs():
    """Returns all available clubs"""
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT club_id, club_name FROM clubs ORDER BY club_name")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def get_club_by_code(code):
    """Returns club information by 4-digit code"""
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT club_id, club_name, code FROM clubs WHERE code = ?", (code,))
        row = cursor.fetchone()
        return dict(row) if row else None

def add_tutor_to_club(tutor_id, club_id):
    """Adds a tutor to a club if not already a member"""
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        # Check if already in club
        cursor.execute("SELECT * FROM tutor_clubs WHERE tutor_id = ? AND club_id = ?", (tutor_id, club_id))
        existing = cursor.fetchone()
        if not existing:
            cursor.execute("INSERT INTO tutor_clubs (tutor_id, club_id) VALUES (?, ?)", (tutor_id, club_id))
            conn.commit()
            return True
        return False

def upgrade_student_to_tutor(user_id):
    """Upgrades a student user to tutor auth level"""
    with sqlite3.connect("requests.db") as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET user_auth = 'Tutor' WHERE user_id = ?", (user_id,))
        conn.commit()

def get_tutor_clubs(tutor_id):
    """Returns the list of club IDs that a tutor belongs to"""
    with sqlite3.connect("requests.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT club_id FROM tutor_clubs WHERE tutor_id = ?", (tutor_id,))
        rows = cursor.fetchall()
        return [row['club_id'] for row in rows]

def get_allowed_subjects(tutor_id):
    """
    Returns the list of subjects a tutor can see based on their club memberships.
    
    Club-to-Subject mapping:
    1 = National Honor Society → ALL subjects
    2 = Computer Science Honor Society → Computer Science
    3 = Rho Kappa Honor Society → History
    4 = National English Honor Society → English
    5 = Science National Honor Society → Science
    6 = German Honor Society → German
    7 = Spanish Honor Society → Spanish
    8 = French Honor Society → French
    9 = Mu Alpha Theta → Math
    """
    clubs = get_tutor_clubs(tutor_id)
    
    # If tutor is in National Honor Society, they can see all subjects
    if 1 in clubs:
        return ["Math", "English", "Science", "History", "German", "Spanish", "French", "Computer Science"]
    
    # Otherwise, map clubs to subjects
    allowed_subjects = set()
    club_to_subject = {
        2: "Computer Science",
        3: "History",
        4: "English",
        5: "Science",
        6: "German",
        7: "Spanish",
        8: "French",
        9: "Math"
    }
    
    for club_id, subject in club_to_subject.items():
        if club_id in clubs:
            allowed_subjects.add(subject)
    
    return list(allowed_subjects) if allowed_subjects else []