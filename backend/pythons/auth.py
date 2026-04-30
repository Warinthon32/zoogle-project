import pyodbc
from functools import wraps
from flask import Blueprint, request, session, jsonify
from werkzeug.security import check_password_hash


auth_bp = Blueprint("auth", __name__)



def get_db_connection():
    try:
        server = r'localhost\SQLEXPRESS'
        database = 'ZoogleDB'
        conn_str = (
            f"DRIVER={{SQL Server}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            "Trusted_Connection=yes;"
        )
        return pyodbc.connect(conn_str)
    except Exception as e:
        print("DB Connection Error:", e)
        raise



def row_to_dict(cursor, row):
    """Map a pyodbc Row to a plain Python dict using cursor.description."""
    columns = [col[0] for col in cursor.description]
    return dict(zip(columns, row))


def require_admin(f):
    """
    Decorator that blocks access unless an active admin session exists.

    Usage:
        @app.route("/api/animals")
        @require_admin
        def get_animals():
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("logged_in") or session.get("role", "").lower() != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated_function


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a staff member.

    Request body (JSON):
        { "username": "john_doe", "password": "secret" }

    Responses:
        200  — login successful (admin role)
        401  — user not found or wrong password
        403  — user found but not an admin
        422  — missing / malformed JSON body
    """
    data = request.get_json(silent=True)
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "username and password are required"}), 422

    username = data["username"].strip()
    password = data["password"]

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT Name, Surname, Nickname, Role, Username, Password, Phone "
            "FROM Staff WHERE Username = ?",
            (username,)
        )
        row = cursor.fetchone()

        if row is None:

            return jsonify({"error": "Invalid credentials"}), 401

        staff = row_to_dict(cursor, row)

    
        stored_password = staff["Password"]

        if stored_password.startswith("pbkdf2:") or stored_password.startswith("scrypt:"):

            password_ok = check_password_hash(stored_password, password)
        else:
       
            password_ok = (stored_password == password)

        if not password_ok:
            return jsonify({"error": "Invalid credentials"}), 401

       #role check
        role = (staff.get("Role") or "").strip()

        if role.lower() != "admin":
            return jsonify({"error": "Access restricted to admin accounts"}), 403

        
        session.clear()
        session["logged_in"] = True
        session["username"]  = staff["Username"]
        session["role"]      = role
        session["name"]      = f"{staff['Name']} {staff['Surname']}"
        session.permanent    = True 

        return jsonify({
            "message": "Login successful",
            "user": {
                "username": staff["Username"],
                "name":     f"{staff['Name']} {staff['Surname']}",
                "nickname": staff.get("Nickname"),
                "role":     role,
            }
        }), 200

    except pyodbc.Error as db_err:
        return jsonify({"error": "Database error", "detail": str(db_err)}), 500

    finally:
        if conn:
            conn.close()



@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Clear the session and log the user out."""
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200



@auth_bp.route("/me", methods=["GET"])
def me():
    """
    Return the currently authenticated user's session info.

    200 — logged in (with user data)
    401 — not logged in
    """
    if not session.get("logged_in"):
        return jsonify({"error": "Not authenticated"}), 401

    return jsonify({
        "logged_in": True,
        "username":  session.get("username"),
        "name":      session.get("name"),
        "role":      session.get("role"),
    }), 200