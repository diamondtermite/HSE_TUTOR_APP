from flask import Flask, jsonify, session, request # all imports needed for flask
from flask_cors import CORS # flask cors, needed to make the connection between frontend and backend
from flask_session import Session # flask session, creates user sessions with cache so users stay logged in
from datetime import datetime # used to simply format time strings, specifically for displaying requests
import queries as q # the python file used to interact with the SQL database

"""
The backend flask application for the HSE Tutor App

Routes:
/api/ - index route/home route
/api/login - the route for the user to log in, having implementations for different auth levels of student, tutor, and teacher
/api/logout - the route for the user to log out, clearing their session
/api/addrequest - the route for a student/tutor to add a tutoring request
/api/requests - the route to view tutoring requests, with query parameters to filter requests based on user role and use case for the display
/api/acceptrequest/<request_id> - the route for a tutor to accept a tutoring request

"""
#Flask app setup
app = Flask(__name__) 
app.secret_key = "placeholder secret key for now" # secret key require for sessions
app.config["SESSION_PERMANENT"] = True # session made permanent, so that the user stays logged in for a set amount of time rather than a refresh
app.config["SESSION_TYPE"] = "cachelib" # stores information on the browser cache
Session(app)
CORS(app)

@app.route('/api/')
def index():
    return jsonify({"message": "If you can see this, then Flask works"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = q.get_user_by_email(email) # fetch user from database by email

    if user and user['user_password'] == password: # check if user exists and password matches, in future this will be replaced by the Microsoft API
        session['user_id'] = user['user_id'] # saving user in session
        return jsonify({
            "success":True,
            "user": {
                    "id": user['user_id'],
                    "email": user['user_email'],
                    "auth": user['user_auth']
            }
        })
    else:
        return jsonify({"success": False, "message": "Invalid authentication"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear() # simply clearing the session
    return jsonify({"success": True, "message": "Logged out successfully"})

@app.route('/api/addrequest', methods=['POST'])
def add_request():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.get_json()
    class_subject = data.get('classSubject')
    date = data.get('date')
    start_time = datetime.strptime(data.get('startTime'), "%H:%M").strftime("%I:%M %p").lstrip("0") # formatting time to 12 hour format with AM/PM and no leading zeroes
    end_time = datetime.strptime(data.get('endTime'), "%H:%M").strftime("%I:%M %p").lstrip("0")
    location = data.get('location')

    if not class_subject or not date or not start_time or not end_time or not location: # if some field is not filled, return error
        return jsonify({"success": False, "message": f"Missing required fields {class_subject}, {date}, {start_time}, {end_time}, {location}"}), 400

    try:
        request_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"success": False, "message": "Invalid date format."}), 400

    now = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    month = now.month + 6
    year = now.year + (month - 1) // 12
    month = ((month - 1) % 12) + 1
    month_lengths = [31, 29 if (year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    day = min(now.day, month_lengths[month - 1])
    six_months_from_now = now.replace(year=year, month=month, day=day)

    if request_date > six_months_from_now:
        return jsonify({"success": False, "message": "Request date must be within 6 months from today."}), 400

    q.add_request(session["user_id"], class_subject, date, start_time, end_time, location) # adding request to the database
    return jsonify({"success": True, "message": "Request added successfully"})

@app.route('/api/requests', methods=['GET'])
def requests():
    """
    Requests is used to fetch all tutoring requests from the database based on query parameters/filters and purpose of the view.

    hide_accepted: When true, it hides requests that have been accepted by a tutor or have passed (used for the view which a tutor can see open requests)
    self: When false, it only shows requests not made by the user (used for the view which a tutor can see open requests)
    only_self: When true, it only shows requests made by the user (used for the view for students to see their own requests)
    tutor: When true, it only shows requests accepted by the user (used only for viewers, to be used on the tutor's dashboard)
    """
    # getting query parameters from the request
    hide_accepted = request.args.get('hide_accepted', 'false').lower() == 'true'
    self = request.args.get('self', 'true').lower() == "false"
    only_self = request.args.get('only_self', 'false').lower() == 'true'
    tutor = request.args.get('tutor', 'false').lower() == 'true'
    include_archived = request.args.get('include_archived', 'false').lower() == 'true'

    query = "SELECT requests.*, users.user_email AS tutor_email FROM requests LEFT JOIN users ON requests.tutor_id = users.user_id WHERE 1=1"
    params = [] # all parameters to be passed into the query

    if not include_archived:
        query += " AND archived = 0"

    if hide_accepted:
        query += " AND tutor_id IS NULL"

    if self:
        query += " AND student_id != ?"
        params.append(session["user_id"]) # adding in the information for placeholders in the query in the params list

    if only_self:
        query += " AND student_id = ?"
        params.append(session["user_id"])
    
    if tutor:
        query += " AND tutor_id = ?"
        params.append(session["user_id"])

    requests_data = q.get_requests(query, params) # fetching requests from the database based on the constructed query and parameters
    
    # Filter requests by subject if the user is a tutor
    user = q.get_user_by_id(session.get('user_id'))
    if user and user.get('user_auth') == 'Tutor':
        allowed_subjects = q.get_allowed_subjects(session.get('user_id'))
        if allowed_subjects:  # Only filter if the tutor has some allowed subjects
            requests_data = [r for r in requests_data if r.get('request_subject') in allowed_subjects]
    
    return jsonify(requests_data)

@app.route('/api/archive_request/<int:request_id>', methods=['POST'])
def archive_request(request_id):
    user = q.get_user_by_id(session.get('user_id'))
    if not user or user.get('user_auth') != 'Teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    q.set_archive_status(request_id, 1)
    return jsonify({"success": True, "message": "Request archived"})

@app.route('/api/unarchive_request/<int:request_id>', methods=['POST'])
def unarchive_request(request_id):
    user = q.get_user_by_id(session.get('user_id'))
    if not user or user.get('user_auth') != 'Teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    q.set_archive_status(request_id, 0)
    return jsonify({"success": True, "message": "Request unarchived"})

@app.route('/api/remove_tutor/<int:request_id>', methods=['POST'])
def remove_tutor(request_id):
    user = q.get_user_by_id(session.get('user_id'))
    if not user or user.get('user_auth') != 'Teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    q.remove_tutor(request_id)
    return jsonify({"success": True, "message": "Tutor removed"})

@app.route('/api/delete_request/<int:request_id>', methods=['POST'])
def delete_request(request_id):
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    success = q.archive_request_by_user(request_id, session['user_id'])
    if success:
        return jsonify({"success": True, "message": "Request deleted"})
    else:
        return jsonify({"success": False, "message": "You can only delete your own requests"}), 403

@app.route('/api/remove_self/<int:request_id>', methods=['POST'])
def remove_self(request_id):
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    success = q.remove_self_from_request(request_id, session['user_id'])
    if success:
        return jsonify({"success": True, "message": "Removed from request"})
    else:
        return jsonify({"success": False, "message": "You are not assigned to this request"}), 403

@app.route('/api/current_user', methods=['GET'])
def current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"success": False}), 401

    user = q.get_user_by_id(user_id)
    if not user:
        return jsonify({"success": False}), 401

    return jsonify({
        "success": True,
        "user": {
            "id": user['user_id'],
            "email": user['user_email'],
            "auth": user['user_auth']
        }
    })

@app.route('/api/acceptrequest/<int:request_id>', methods=['POST'])
def accept_request(request_id):
    q.accept_request(session["user_id"], request_id) # updating the request in the database to be accepted by the tutor
    return jsonify({"success": True, "message": "Request accepted successfully"})

@app.route('/api/archive_past_requests', methods=['POST'])
def archive_past_requests_route():
    if not session.get('user_id'):
        return jsonify({"success": False, "message": "Not logged in"}), 401
    user = q.get_user_by_id(session['user_id'])
    if user['user_auth'] != 'Teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    q.archive_past_requests()
    return jsonify({"success": True})

@app.route('/api/tutors', methods=['GET'])
def get_tutors():
    if not session.get('user_id'):
        return jsonify({"success": False, "message": "Not logged in"}), 401
    user = q.get_user_by_id(session['user_id'])
    if user['user_auth'] != 'Teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    tutors = q.get_all_tutors()
    return jsonify(tutors)

@app.route('/api/clubs', methods=['GET'])
def get_clubs():
    if not session.get('user_id'):
        return jsonify({"success": False, "message": "Not logged in"}), 401
    user = q.get_user_by_id(session['user_id'])
    if user['user_auth'] != 'Teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    clubs = q.get_all_clubs()
    return jsonify(clubs)

@app.route('/api/join_club', methods=['POST'])
def join_club():
    if not session.get('user_id'):
        return jsonify({"success": False, "message": "Not logged in"}), 401
    
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({"success": False, "message": "Missing club code"}), 400
    
    user = q.get_user_by_id(session['user_id'])
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    club = q.get_club_by_code(code)
    if not club:
        return jsonify({"success": False, "message": "Invalid code"}), 400
    
    # If student, upgrade to tutor
    is_new_tutor = False
    if user['user_auth'] == 'Student':
        q.upgrade_student_to_tutor(session['user_id'])
        is_new_tutor = True
    
    # Add to club
    is_new_member = q.add_tutor_to_club(session['user_id'], club['club_id'])
    
    return jsonify({
        "success": True, 
        "message": f"Successfully joined {club['club_name']}",
        "club_name": club['club_name'],
        "is_new_tutor": is_new_tutor
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
