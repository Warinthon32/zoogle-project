from flask import Flask, jsonify
from flask_cors import CORS


# ─── Import Controllers ────────────────────────────────────
from pythons.adminApi import admin_bp
from pythons.animalShowApi import animal_bp


app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500"])


app.register_blueprint(admin_bp)
app.register_blueprint(animal_bp)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)