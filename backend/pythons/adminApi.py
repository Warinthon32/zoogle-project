from flask import Flask, jsonify, request, abort, Blueprint
import pyodbc

MEDIA_BASE_URL = "http://127.0.0.1:5500/frontend/images/"

admin_bp = Blueprint('admin', __name__)

def get_db_connection():
    try:
        server = 'localhost\SQLEXPRESS'
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

def _format_animal_row(row):
    return {
        "id": row.AID,
        "name": row.Name,
        "sciName": row.SciName,
        "category": row.Category,
        "zone": row.Zone,
        "image": (MEDIA_BASE_URL + row.MainImage) if row.MainImage else None,
        "dangerLevel": row.DangerousLevel
    }

@admin_bp.route('/api/animals', methods=['POST'])
def save_animals():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        data = request.get_json()

        cursor.execute("""
            INSERT INTO Animal (
                Name, SciName, BioCharacter, Sex, BirthDate,
                Quantity, Class, Description,
                CID, ParentID, CAID
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get("name"),
            data.get("sciName"),
            data.get("bioCharacter"),
            data.get("sex"),
            data.get("birthDate"),
            data.get("quantity"),
            data.get("class"),
            data.get("description"),
            data.get("categoryId"),
            data.get("parentId"),
            data.get("cageId"),
        ))

        conn.commit()

        animals = [_format_animal_row(row) for row in cursor.fetchall()]
        return jsonify(animals)

    except Exception as e:
        print("Error /api/animals:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


@admin_bp.route('/api/animals/<int:aid>', methods=['DELETE'])
def del_animals(aid):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()


        cursor.execute("""
            DELETE FROM Animal
            WHERE AID = %s
        """, (aid,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "success": False,
                "message": "Animal not found"
            })
        
        return jsonify({
            "deletedId": aid
        })

    except Exception as e:
        print(f"Error /api/animals/{aid}:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn: conn.close()

@admin_bp.route('/api/health-records', methods=['GET'])
def get_health_records():
    conn = None
    try:
        animal_id = request.args.get('animalId')

        conn = get_db_connection()
        cursor = conn.cursor()

        if animal_id:
            cursor.execute("""
                SELECT hr.*
                FROM HealthRecord hr
                JOIN Has_Record r ON hr.HID = r.HID
                WHERE r.AID = %s
                ORDER BY hr.CheckupDate DESC
            """, (animal_id,))
        else:
            cursor.execute("""
                SELECT * FROM HealthRecord
                ORDER BY CheckupDate DESC
            """)

        rows = cursor.fetchall()

        return jsonify(rows), 200
    
    except Exception as e:
        print(f"Error /api/health-records:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn: conn.close()


@admin_bp.route('/api/health-records', methods=['POST'])
def add_health_record():
    conn = None
    try:
        data = request.get_json()

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO HealthRecord (
                CheckupDate, Status, Notes, SID
            )
            VALUES (%s, %s, %s, %s)
        """, (
            data.get("checkupDate"),
            data.get("status"),
            data.get("notes"),
            data.get("staffId")
        ))

        record_id = cursor.lastrowid


        cursor.execute("""
            INSERT INTO Has_Record (HID, AID)
            VALUES (%s, %s)
        """, (
            record_id,
            data.get("animalId")
        ))

        conn.commit()

        return jsonify({
            "recordId": record_id
        })

    except Exception as e:
        print(f"Error /api/health-records:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn: conn.close()

@admin_bp.route('/api/staff', methods=['GET'])
def get_staff():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                *
            FROM Staff
        """)

        rows = cursor.fetchall()

        return jsonify(rows)

    except Exception as e:
        print(f"Error /api/staff:", e)
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:
        if conn: conn.close()


@admin_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # total animals
        cursor.execute("SELECT COUNT(*) FROM Animal")
        total_animals = cursor.fetchone()[0]

        # active medical records
        cursor.execute("""
            SELECT COUNT(*) 
            FROM HealthRecord
            WHERE Status = 'active'
        """)
        active_medical_records = cursor.fetchone()[0]

        # total staff
        cursor.execute("SELECT COUNT(*) FROM Staff")
        total_staff = cursor.fetchone()[0]

        # upcoming events
        cursor.execute("""
            SELECT COUNT(*)
            FROM Event
            WHERE ShowDate >= CURDATE()
        """)
        upcoming_events = cursor.fetchone()[0]

        return jsonify({
            "totalAnimals": total_animals,
            "activeMedicalRecords": active_medical_records,
            "totalStaff": total_staff,
            "upcomingEvents": upcoming_events
        })

    except Exception as e:
        print(f"Error /api/dashboard/stats:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()