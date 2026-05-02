from flask import Flask, jsonify, request, abort, Blueprint, send_from_directory
import pyodbc
from datetime import datetime
import config

from db import get_db_connection

from pythons.uploadFile import save_upload, delete_animal_files

admin_bp = Blueprint('admin', __name__)





@admin_bp.route('/admin_animals', methods=['GET'])
def get_all_admin_animals():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        category = request.args.get('category')

        query = """
            SELECT
                a.AID,
                a.Name,
                a.SciName,
                a.BioCharacter,
                a.Sex,
                a.BirthDate,
                a.Quantity,
                a.Class,
                a.Description,
                a.CID,
                a.ParentID,
                a.CAID,
                c.CName        AS Category,
                ca.DangerousLevel,
                z.ZID,
                z.ZName        AS Zone,
                d.DID,
                d.DietType     AS Diet,
                (
                    SELECT TOP 1 m.MediaURL
                    FROM MediaURL m
                    JOIN Has_Media hm ON m.MID = hm.MID
                    WHERE hm.AID = a.AID
                ) AS MainImage
            FROM Animal a
            LEFT JOIN Category c  ON a.CID  = c.CID
            LEFT JOIN Cage ca     ON a.CAID = ca.CAID
            LEFT JOIN Zone z      ON ca.ZID = z.ZID
            LEFT JOIN Consumes co ON a.AID  = co.AID
            LEFT JOIN Diet d      ON co.DID = d.DID
        """

        params = []
        if category:
            query += " WHERE c.CName = ?"
            params.append(category)

        cursor.execute(query, params)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        result = []

        for row in rows:
            data = dict(zip(columns, row))
            result.append({
                "id":           data["AID"],
                "name":         data["Name"],
                "sciName":      data["SciName"],
                "bioCharacter": data["BioCharacter"],
                "sex":          data["Sex"],
                "birthDate":    str(data["BirthDate"]) if data["BirthDate"] else None,
                "quantity":     data["Quantity"],
                "class":        data["Class"],
                "description":  data["Description"],
                "categoryId":   data["CID"],
                "category":     data["Category"],
                "parentId":     data["ParentID"],
                "cageId":       data["CAID"],
                "dangerLevel":  data["DangerousLevel"],
                "zoneId":       data["ZID"],
                "zone":         data["Zone"],
                "dietId":       data["DID"],
                "diet":         data["Diet"],
                "image": config.BACKEND_URL + data["MainImage"] if data["MainImage"] else None
            })


        return jsonify(result)

    except Exception as e:
        print("Error /admin_animals:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


@admin_bp.route('/uploads/animals/<path:filename>')
def serve_upload_file(filename):
    return send_from_directory(config.UPLOAD_FOLDER, filename)

@admin_bp.route('/upload/image', methods=['POST'])
def upload_image():
    conn = None
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        animal_id = request.form.get('animalId')
        if not animal_id or not animal_id.isdigit():
            return jsonify({"error": "Missing or invalid animalId"}), 400

        animal_id = int(animal_id)
        file = request.files['image']

        try:
            result = save_upload(file, animal_id)   # ← ส่ง AID เข้าไป
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400

        public_url = f"{config.UPLOAD_API}/{result['filename']}"

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO Gallery (MediaType) VALUES (?);
            SELECT SCOPE_IDENTITY();
        """, ('image',))
        cursor.nextset()
        mid = int(cursor.fetchone()[0])

        cursor.execute(
            "INSERT INTO MediaURL (MID, MediaURL) VALUES (?, ?)",
            (mid, public_url)
        )

        # โยง Has_Media กับ animal
        cursor.execute(
            "INSERT INTO Has_Media (AID, MID, UploadDate) VALUES (?, ?, ?)",
            (animal_id, mid, datetime.now())
        )

        conn.commit()
        return jsonify({"success": True, "url": public_url, "mid": mid})

    except Exception as e:
        print("Error /upload/image:", e)
        return jsonify({"error": "Upload failed"}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/animals', methods=['POST'])
def save_animals():
    conn = None
    try:
        conn   = get_db_connection()
        cursor = conn.cursor()
        data   = request.get_json()

        cursor.execute("""
            DECLARE @NewAID INT;

            INSERT INTO Animal (
                Name, SciName, BioCharacter, Sex, BirthDate,
                Quantity, Class, Description,
                CID, ParentID, CAID
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

            SET @NewAID = SCOPE_IDENTITY();
            SELECT @NewAID;
        """, (
            data.get("name"),
            data.get("sciName"),
            data.get("bioCharacter")  or None,
            data.get("sex"),
            data.get("birthDate")     or None,
            data.get("quantity")      or 1,
            data.get("class"),
            data.get("description")   or None,
            data.get("categoryId"),
            data.get("parentId")      or None,
            data.get("cageId"),
        ))

        cursor.nextset()
        new_aid = int(cursor.fetchone()[0])

        # Diet
        if new_aid and data.get("dietId"):
            cursor.execute("""
                INSERT INTO Consumes (DID, AID) VALUES (?, ?)
            """, (data.get("dietId"), new_aid))

        # ถ้ามี mediaId ให้ link Has_Media
        if new_aid and data.get("mediaId"):
            from datetime import datetime
            cursor.execute("""
                INSERT INTO Has_Media (MID, AID, UploadDate)
                VALUES (?, ?, ?)
            """, (data.get("mediaId"), new_aid, datetime.now()))

        conn.commit()

        return jsonify({"success": True, "aid": new_aid})

    except Exception as e:
        print("Error /animals:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


@admin_bp.route('/animals/<int:aid>', methods=['PUT'])
def update_animal(aid):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        data = request.get_json()

        # UPDATE main table
        cursor.execute("""
            UPDATE Animal
            SET Name = ?,
                SciName = ?,
                BioCharacter = ?,
                Sex = ?,
                BirthDate = ?,
                Quantity = ?,
                Class = ?,
                Description = ?,
                CID = ?,
                ParentID = ?,
                CAID = ?
            WHERE AID = ?
        """, (
            data.get("name"),
            data.get("sciName"),
            data.get("bioCharacter") or None,
            data.get("sex"),
            data.get("birthDate") or None,
            data.get("quantity") or 1,
            data.get("class"),
            data.get("description") or None,
            data.get("categoryId"),
            data.get("parentId") or None,
            data.get("cageId"),
            aid
        ))

        # update diet 
        cursor.execute("DELETE FROM Consumes WHERE AID = ?", (aid,))

        if data.get("dietId"):
            cursor.execute("""
                INSERT INTO Consumes (DID, AID)
                VALUES (?, ?)
            """, (data.get("dietId"), aid))

        conn.commit()

        return jsonify({
            "success": True,
            "aid": aid
        })

    except Exception as e:
        print("Error /animals PUT:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()

def delete_has_media_by_animal(cursor, aid: int):
    # หา MID ทั้งหมดของ animal นี้
    cursor.execute("""
        SELECT MID FROM Has_Media WHERE AID = ?
    """, (aid,))
    
    mids = [row[0] for row in cursor.fetchall()]

    # ลบ relation
    cursor.execute("DELETE FROM Has_Media WHERE AID = ?", (aid,))

    # ลบ media
    for mid in mids:
        cursor.execute("SELECT COUNT(*) FROM Has_Media WHERE MID = ?", (mid,))
        count = cursor.fetchone()[0]

        if count == 0:
            cursor.execute("DELETE FROM MediaURL WHERE MID = ?", (mid,))
            cursor.execute("DELETE FROM Gallery WHERE MID = ?", (mid,))

def delete_health_records_by_animal(cursor, aid: int):
    # หา HID
    cursor.execute("""
        SELECT HID FROM Has_Record WHERE AID = ?
    """, (aid,))
    
    hids = [row[0] for row in cursor.fetchall()]

    # ลบ relation
    cursor.execute("DELETE FROM Has_Record WHERE AID = ?", (aid,))

    # ลบ records
    for hid in hids:
        cursor.execute("SELECT COUNT(*) FROM Has_Record WHERE HID = ?", (hid,))
        count = cursor.fetchone()[0]

        if count == 0:
            cursor.execute("DELETE FROM HealthRecord WHERE HID = ?", (hid,))


@admin_bp.route('/animals/<int:aid>', methods=['DELETE'])
def del_animals(aid):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        #ลบ ทำให้ parent ของ animal อื่น null

        cursor.execute("""
            UPDATE Animal
            SET ParentID = NULL
            WHERE ParentID = ?
        """, (aid,))

        #ลบ child tables
        cursor.execute("DELETE FROM Consumes WHERE AID = ?", (aid,))
        cursor.execute("DELETE FROM Participates WHERE AID = ?", (aid,))

        delete_health_records_by_animal(cursor, aid)
        delete_has_media_by_animal(cursor, aid)

        # ลบ parent
        cursor.execute("DELETE FROM Animal WHERE AID = ?", (aid,))

        conn.commit()

        delete_animal_files(aid)

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

        base_query = """
            SELECT 
                hr.HID,
                hr.CheckupDate,
                hr.Status,
                hr.Notes,
                hr.SID,
                s.Name,
                s.Surname,
                r.AID
            FROM HealthRecord hr
            LEFT JOIN Staff s ON hr.SID = s.SID
            LEFT JOIN Has_Record r ON hr.HID = r.HID
        """

        params = []

        if animal_id:
            base_query += " WHERE r.AID = ?"
            params.append(animal_id)

        base_query += " ORDER BY hr.CheckupDate DESC"

        cursor.execute(base_query, params)

        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        result = []
        for row in rows:
            data = dict(zip(columns, row))

            result.append({
                "id": data.get("HID"),
                "animalId": data.get("AID"),
                "checkupDate": data.get("CheckupDate"),
                "status": data.get("Status"),
                "notes": data.get("Notes"),
                "staffId": data.get("SID"),
                "staffName": f"{data.get('Name', '')} {data.get('Surname', '')}".strip()
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
            INSERT INTO HealthRecord (CheckupDate, Status, Notes, SID)
            OUTPUT INSERTED.HID

            VALUES (?, ?, ?, ?)
        """, (
            data.get("checkupDate"),
            data.get("status"),
            data.get("notes"),
            data.get("staffId") or None
        ))


        row = cursor.fetchone()
        new_hid = row[0] if row else None

        cursor.execute("""
            INSERT INTO Has_Record (HID, AID)
            VALUES (?, ?)
        """, (new_hid, data.get("animalId")))

        conn.commit()

        return jsonify({
            "success": True
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

@admin_bp.route('/animal/<int:aid>/media/main', methods=['GET'])
def get_animal_media_url_main(aid):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT TOP 1 m.MediaURL, hm.UploadDate, hm.MID
            FROM Has_Media hm
            JOIN MediaURL m ON hm.MID = m.MID
            WHERE hm.AID = ?
            ORDER BY hm.UploadDate ASC
        """, (aid,))

        row = cursor.fetchone()

        if not row:
            return jsonify({"url": None})

        return jsonify({
            "mid": row[2],
            "url": config.BACKEND_URL + str(row[0]),
            "uploadDate": row[1]
        })

    except Exception as e:
        print(f"Error /animal-media/{aid}:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()

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
            "url": config.BACKEND_URL + str(row.MediaURL) if row.MediaURL else None,
            "uploadDate": str(row.UploadDate) if row.UploadDate else None
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)


@admin_bp.route('/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            e.EID,
            e.ShowName,
            e.ShowTime,
            e.ShowDate,
            z.ZID,
            z.ZName,
            z.Theme,
            z.Weather
        FROM Event e
        LEFT JOIN Zone z ON e.ZID = z.ZID
    """)

    result = [
        {
            "eid": row.EID,
            "showName": row.ShowName,
            "showTime": str(row.ShowTime)[:5] if row.ShowTime else None,
            "showDate": str(row.ShowDate)[:10] if row.ShowDate else None,
            "zone": {
                "zid": row.ZID,
                "name": row.ZName,
                "theme": row.Theme,
                "weather": row.Weather
            } if row.ZID else None
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(result)