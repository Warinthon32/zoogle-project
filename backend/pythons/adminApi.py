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

@admin_bp.route('/admin_animals', methods=['GET'])
def get_all_admin_animals():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        category = request.args.get('category')

        query = """
            SELECT
                *,
                (
                    SELECT TOP 1 m.MediaURL
                    FROM MediaURL m
                    JOIN Has_Media hm ON m.MID = hm.MID
                    WHERE hm.AID = v.AID
                ) AS MainImage
            FROM vw_animal_full_info v
        """

        if category:
            query += " WHERE v.Category = ?"
            cursor.execute(query, (category,))
        else:
            cursor.execute(query)

        animals = [_format_animal_row(row) for row in cursor.fetchall()]
        return jsonify(animals)

    except Exception as e:
        print("Error /animals:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()

@admin_bp.route('/animals', methods=['POST'])
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("name"),
            data.get("sciName"),
            data.get("bioCharacter") or None,
            data.get("sex"),
            data.get("birthDate"),
            data.get("quantity") or 1,
            data.get("class"),
            data.get("description") or None,
            data.get("categoryId"),
            data.get("parentId") or None,
            data.get("cageId"),
        ))

      
        conn.commit()

        return jsonify({"success": "true"})

    except Exception as e:
        print("Error /animals:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


@admin_bp.route('/animals/<int:aid>', methods=['DELETE'])
def del_animals(aid):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        #ลบ child tables
        cursor.execute("DELETE FROM Consumes WHERE AID = ?", (aid,))
        cursor.execute("DELETE FROM Has_Media WHERE AID = ?", (aid,))
        cursor.execute("DELETE FROM Has_Record WHERE AID = ?", (aid,))
        cursor.execute("DELETE FROM Participates WHERE AID = ?", (aid,))

        # ลบ parent
        cursor.execute("DELETE FROM Animal WHERE AID = ?", (aid,))
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
        print(f"Error /animals/{aid}:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn: conn.close()

@admin_bp.route('/health-records', methods=['GET'])
def get_health_records():
    conn = None
    try:
        animal_id = request.args.get('animalId')

        conn = get_db_connection()
        cursor = conn.cursor()

        if animal_id:
            cursor.execute("""
                SELECT hr.*, s.Name, s.Surname
                FROM HealthRecord hr
                JOIN Has_Record r ON hr.HID = r.HID
                LEFT JOIN Staff s ON hr.SID = s.SID
                WHERE r.AID = ?
                ORDER BY hr.CheckupDate DESC
            """, (animal_id,))
        else:
            cursor.execute("""
                SELECT hr.*, s.Name, s.Surname
                FROM HealthRecord hr
                LEFT JOIN Staff s ON hr.SID = s.SID
                ORDER BY hr.CheckupDate DESC
            """)

        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        result = []
        for row in rows:
            data = dict(zip(columns, row))


            result.append({
                "id": data.get("HID"),
                "checkupDate": data.get("CheckupDate"),
                "status": data.get("Status"),
                "notes": data.get("Notes"),
                "staffId": data.get("SID"),
                "staffName": data.get('Name', '')
            })

        return jsonify(result)
    
    except Exception as e:
        print(f"Error /health-records:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn: conn.close()


@admin_bp.route('/health-records', methods=['POST'])
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
            VALUES (?, ?, ?, ?);
            SELECT SCOPE_IDENTITY();
        """, (
            data.get("checkupDate"),
            data.get("status"),
            data.get("notes"),
            data.get("staffId")
        ))

        conn.commit()

        return jsonify({
            "success": "true"
        })

    except Exception as e:
        print(f"Error /health-records:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn: conn.close()

@admin_bp.route('/staff', methods=['GET'])
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

        result = []
        for row in rows:
            result.append({
                "id": row.SID,
                "firstName": row.Name,
                "lastName": row.Surname,
                "role": row.Role,
                "phone": row.Phone,
                "salary": row.Salary,
                "cageId": row.CAID
            })

        return jsonify(result)

    except Exception as e:
        print(f"Error /staff:", e)
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:
        if conn: conn.close()


@admin_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM Animal")
        total_animals = cursor.fetchone()[0]

        cursor.execute("""
            SELECT COUNT(*) 
            FROM HealthRecord
            WHERE Status = 'active'
        """)
        active_medical_records = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Staff")
        total_staff = cursor.fetchone()[0]

        cursor.execute("""
            SELECT COUNT(*)
            FROM Event
            WHERE ShowDate >= CAST(GETDATE() AS DATE)
        """)
        upcoming_events = cursor.fetchone()[0]

        return jsonify({
            "totalAnimals": total_animals,
            "activeMedicalRecords": active_medical_records,
            "totalStaff": total_staff,
            "upcomingEvents": upcoming_events
        })

    except Exception as e:
        print(f"Error /dashboard/stats:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()

@admin_bp.route('/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT CID, CName, Class, Description FROM Category")

    result = [
        {
            "cid": row.CID,
            "name": row.CName,
            "class": row.Class,
            "description": row.Description
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)


@admin_bp.route('/cages', methods=['GET'])
def get_cages():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT CAID, DangerousLevel, ZID
        FROM Cage
    """)

    result = [
        {
            "caid": row.CAID,
            "dangerousLevel": row.DangerousLevel,
            "zid": row.ZID
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)


@admin_bp.route('/zones', methods=['GET'])
def get_zones():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT ZID, ZName, Theme, Weather FROM Zone")

    result = [
        {
            "zid": row.ZID,
            "name": row.ZName,
            "theme": row.Theme,
            "weather": row.Weather
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)


@admin_bp.route('/diets', methods=['GET'])
def get_diets():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT DID, DietType, Description FROM Diet")

    result = [
        {
            "did": row.DID,
            "dietType": row.DietType,
            "description": row.Description
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)

@admin_bp.route('/consumes', methods=['GET'])
def get_consumes():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT DID, AID FROM Consumes")

    result = [
        {
            "aid": row.AID,
            "did": row.DID
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)


@admin_bp.route('/has-media', methods=['GET'])
def get_has_media():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT hm.AID, hm.MID, m.MediaURL, hm.UploadDate
        FROM Has_Media hm
        LEFT JOIN MediaURL m ON hm.MID = m.MID
    """)

    result = [
        {
            "aid": row.AID,
            "mid": row.MID,
            "url": row.MediaURL,
            "uploadDate": str(row.UploadDate) if row.UploadDate else None
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)