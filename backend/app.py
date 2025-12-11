from flask import Flask, jsonify, session, request
from flask_cors import CORS
from flask_session import Session
import queries as q

app = Flask(__name__)
app.secret_key = "placeholder secret key for now"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "cachelib"
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

    user = q.get_user_by_email(email)

    if user and user['user_password'] == password:
        session['user_id'] = user['user_id']
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
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully"})

@app.route('/api/addrequest', methods=['POST'])
def add_request():
    data = request.get_json()
    title = data.get('title')
    student_grade = data.get('studentGrade')
    class_subject = data.get('classSubject')
    description = data.get('description')

    if not title or not student_grade or not class_subject or not description:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    q.add_request(session["user_id"], title, student_grade, class_subject, description)
    return jsonify({"success": True, "message": "Request added successfully"})

@app.route('/api/requests', methods=['GET'])
def requests():
    requests = q.get_requests()
    return jsonify(requests)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
