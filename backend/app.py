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

app.route('/api/logout', methods=['POST'])
def logout():
    session.clear() # simply clearing the session
    return jsonify({"success": True, "message": "Logged out successfully"})

@app.route('/api/addrequest', methods=['POST'])
def add_request():
    data = request.get_json()
    class_subject = data.get('classSubject')
    date = data.get('date')
    start_time = datetime.strptime(data.get('startTime'), "%H:%M").strftime("%I:%M %p").lstrip("0") # formatting time to 12 hour format with AM/PM and no leading zeroes
    end_time = datetime.strptime(data.get('endTime'), "%H:%M").strftime("%I:%M %p").lstrip("0")
    location = data.get('location')

    if not class_subject or not date or not start_time or not end_time or not location: # if some field is not filled, return error
        return jsonify({"success": False, "message": f"Missing required fields {class_subject}, {date}, {start_time}, {end_time}, {location}"}), 400

    q.add_request(session["user_id"], class_subject, date, start_time, end_time, location) # adding request to the database
    return jsonify({"success": True, "message": "Request added successfully"})

@app.route('/api/requests', methods=['GET'])
def requests():
    """
    Requests is used to fetch all tutoring requests from the database based on query parameters/filters and purpose of the view.

    hide_accepted: When true, it hides requests that have been accepted by a tutor or have passed (used for the view which a tutor can see open requests)
    self: When false, it only shows requests not made by the user and that don't fall on dates where the user has already accepted a request (used for the view which a tutor can see open requests)
    only_self: When true, it only shows requests made by the user (used for the view for students to see their own requests)
    tutor: When true, it only shows requests accepted by the user (used only for viewers, to be used on the tutor's dashboard)
    """
    # getting query parameters from the request
    hide_accepted = request.args.get('hide_accepted', 'false').lower() == 'true'
    self = request.args.get('self', 'true').lower() == "false"
    only_self = request.args.get('only_self', 'false').lower() == 'true'
    tutor = request.args.get('tutor', 'false').lower() == 'true'

    query = "SELECT * FROM requests WHERE 1=1" # query to be passed in and used to fetch requests from the database
    params = [] # all parameters to be passed into the query

    if hide_accepted:
        query += " AND tutor_id IS NULL AND archived = 0" # adding to the query when the condition for a query parameter is met

    if self:
        query += " AND student_id != ? AND request_date NOT IN (SELECT request_date FROM requests WHERE tutor_id = ?)"
        params.append(session["user_id"]) # adding in the information for placeholders in the query in the params list
        params.append(session["user_id"])

    if only_self:
        query += " AND student_id = ?"
        params.append(session["user_id"])
    
    if tutor:
        query += " AND tutor_id = ?"
        params.append(session["user_id"])

    requests = q.get_requests(query, params) # fetching requests from the database based on the constructed query and parameters
    return jsonify(requests)

@app.route('/api/acceptrequest/<int:request_id>', methods=['POST'])
def accept_request(request_id):
    q.accept_request(session["user_id"], request_id) # updating the request in the database to be accepted by the tutor
    return jsonify({"success": True, "message": "Request accepted successfully"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
