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
        cursor.execute("INSERT INTO requests (student_id, student_name, student_grade, request_subject, request_date, request_start_time, request_end_time, request_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (user_id, get_user_name_by_id(user_id), get_user_grade_by_id(user_id), class_subject, date, start_time, end_time, location)) # inserting a new request into the requests table with the provided details
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