from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/')
def index():
    return jsonify({"message": "If you can see this, then Flask works"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
