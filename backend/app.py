from flask import Flask, jsonify
from flask_cors import CORS
from datetime import timedelta
import os

from pythons.useMockData import initUseMockData

from pythons.adminApi import admin_bp
from pythons.animalShowApi import animal_bp
from pythons.auth import auth_bp

app = Flask(__name__)

app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key-change-in-production-please!")
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

CORS(app,
     resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(animal_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

@app.route("/health")
def health_check():
    return jsonify({"status": "ok"}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

ran = False

@app.before_request
def init_once():
    global ran
    if not ran:
        initUseMockData()
        ran = True

if __name__ == "__main__":

    app.run(debug=True, host="127.0.0.1", port=5000)
    